// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail';
import AuthQuery from './AuthQuery';
import User from '../../../Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthService {
    private authQuery : AuthQuery
    constructor(){
      this.authQuery = new AuthQuery
    }
    public async createUser(userData, ctx){
        let number = Math.floor(Math.random() * 899999 + 100000)
        delete userData.agree
        delete userData.password_confirmation
        let username = userData.first_name +'_'+userData.last_name
        let totalUsers : any[] = await this.authQuery.searchUsername(username)
        let numberOfUsers : number = totalUsers[0].total
        let newCount = numberOfUsers > 0 ? ++numberOfUsers : ''
        username = newCount > 0 ? `${username}_${newCount}` : username
        userData.username = username
        userData.forgot_code= number,
        userData.code_expired= new Date(),
        userData.is_banned='unverified'
        let user = await this.authQuery.createUser(userData)
        if(user){
          let obj ={
            username: user?.first_name +' '+user?.last_name,
            token:user?.forgot_code
          }
          this.sendEmail(obj, user.email)
        }
        return ctx.response.status(200).send({ msg: 'Account created successfully!' })

    }
    async updateCode(uid, number){
      return await this.authQuery.updateUser('id', uid, {
        forgot_code: number,
        code_expired: new Date()
      })
    }
    sendEmail(obj, email){
      return  Mail.send((message) => {
        message
            .from('noreply@gmail.com ','Divine 9')
            .to(email)
            .subject('Please confirm your email address')
            .htmlView('emails.verification_emai',  obj)
      })
    }

    async deleteAccount(user_id){
      let fetch_user:any = await this.authQuery.fetch_user_data(user_id)
      await this.authQuery.deleteAccount(user_id)

      if(fetch_user && fetch_user.isGroupMember && fetch_user.isGroupMember.length ){
         for (let groups of fetch_user.isGroupMember) {
          if( groups.is_admin != 'super admin'){
             await this.authQuery.decrementGroupMember(groups.group_id, '-1')
         }
        }
      }
      if(fetch_user && fetch_user?.isPageFollower && fetch_user?.isPageFollower.length ){
        for (let page of fetch_user.isPageFollower) {
          if( page.page && page.page.user_id != user_id){
            await this.authQuery.decrementPageLike(page.page.id, '-1')
          }
         }
       }
       return fetch_user

    }
    async webLogin(ctx){
      let data = ctx.request.all();
      let user :any = await this.authQuery.getSingleUserInfo('email', data.email)
      if(!user){
        return ctx.response.status(401).send({ msg: 'Invalid credentials!' })
      }
      if(!await Hash.verify(user.password, data.password)){
        return ctx.response.status(401).send({ msg: 'Invalid credentials!' })
      }


      if (user.is_banned == "unverified") {
        return ctx.response.status(401).send({ msg: 'Your account is not verified !', unverified:true ,email:user.email })
      }
       // const hashedPassword = await Hash.make(data.password)
       try{
        return ctx.auth.use("web").attempt(data.email, data.password)
      }catch (error) {
        return ctx.response.status(401).send({ msg: 'Invalid credentials!' })
      }


    }

    async appLogin(data, ctx){
      try {
        let user = await this.authQuery.getSingleUserInfo('email',data.email)
          if(!user){
            return ctx.response.status(401).send({msg : 'Invalid creadential!'})
          }
          if (user.is_banned == "unverified") {
            return ctx.response.status(401).send({ msg: 'Your account is not verified !', unverified:true ,email:user.email })
          }
          let appToken = ctx.request.all().appToken
          let login = await ctx.auth.use("api").attempt(data.email, data.password)
          if(login && appToken){
           await this.authQuery.updateUser('id', user.id, {
             appToken: appToken
            })
            return login
          }

        return login

      } catch (error) {
        return ctx.response.status(422).send(error.messages)
      }

    }
    public async sendResetToken(ctx,data){
      const userInfo :any = await User.findBy('email', data.email)

      if (!userInfo) {
        return ctx.response.status(401).send({ msg: 'Invalid credential!' })
      }

      // generating number
      let number = Math.floor(Math.random() * 899999 + 100000)

       await this.authQuery.updateUser('id', userInfo.id, {
        forgot_code: number,
        code_expired: new Date()
      })

      let userInfo2 :any = await User.findBy('email', data.email)
      let obj ={
        username: userInfo2?.first_name +' '+userInfo2?.last_name,
        token:userInfo2?.forgot_code
      }
      await Mail.send((message) => {
        message
          .from('noreply@divine9connections.com','Divine 9')
          .to(data.email)
          .subject('Please confirm your email address')
          .htmlView('emails/password_reset', obj)
      })

      return ctx.response.status(200).send({ msg: 'Verification code sent successfully!' })

    }

    public async verifyEmail(ctx) {
      let data = ctx.request.all()


      const user :any = await User.query().where('email', data.email).where('forgot_code', data.verificationCode).first();
      if (!user) {
        return ctx.response.status(401).send({ msg: 'Verification code is wrong.' })
      }
       await this.authQuery.updateUser('id', user.id, {
        forgot_code: null,
        code_expired: null,
        is_banned: 'no',
      })

      return ctx.response.status(200).send({ msg: 'Account verified successfully!' })

    }

    public async verifyCode(ctx,data) {
      const user :any = await this.authQuery.singleUserToken('email', data.email, data.verificationCode)
      if (user && user.forgot_code == data.verificationCode) {
        return ctx.response.status(200).send({ msg: 'Succeed! Enter to a new password.' })
      } else {
        return ctx.response.status(401).send({ msg: 'Invalid Code!' })
      }
    }


    public async passwordReset(ctx,data) {
      // let data = ctx.request.all();
      const userInfo :any = await this.authQuery.getSingleUserInfo('email', data.email)
      if (!userInfo){
        return ctx.response.status(401).send({ msg: 'Invalid Credential!' })
      }
       await this.authQuery.updateUser('id', userInfo.id, {
        password: await Hash.make(data.password),
        forgot_code: null,
        code_expired: null
      })

      return ctx.response.status(200).send({ msg: 'Password updated successfully!' })
      // return ctx.auth.use("web").attempt(data.email, data.password)
    }

    async updateOnline(user, isOnline){
       return this.authQuery.updateOnline(user.id, isOnline)
    }
    async fetchUSer(user){
       return this.authQuery.fetchUSer(user.id)
    }


};
