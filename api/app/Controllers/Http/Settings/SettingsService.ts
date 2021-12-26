import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail';
import SettingsQuery from './SettingsQuery';
import Hash from '@ioc:Adonis/Core/Hash'
import User from '../../../Models/User'

export default class SettingService {
    private settingsQuery : SettingsQuery
    constructor(){
      this.settingsQuery = new SettingsQuery
    }
    public async getExampleByLimit(ctx : HttpContextContract){
      const limit = ctx.request.all().limit
      const user = await this.settingsQuery.getUserByLimit(limit)
      return user
   }
    public async profileSettingUpdate(ctx : HttpContextContract){
      let data = ctx.request.all()
      let userId = ctx.auth.user?.id
      if(!userId) return
      // return data
      return this.settingsQuery.profileSettingUpdate(data, userId)
   }
    public async emailVerify(ctx : HttpContextContract){
      let data = ctx.request.all()
      let user:any = ctx.auth.user

      // let verify :any = this.settingsQuery.emailVerification(data.token, userId)
      const verify :any = await User.query().where('email', user.email).where('forgot_code', data.token).first();
      if (!verify) {
        return ctx.response.status(401).send({ msg: 'Verification code is wrong.' })
      }
      if(!verify && !verify.email) return ctx.response.status(401).send({ msg: 'Verification code is wrong.' })
      delete data.token
      return this.settingsQuery.profileSettingUpdate(data, user?.id)
   }
    public async changePassword(ctx : HttpContextContract){
      let data = ctx.request.all()
      let userId = ctx.auth.user?.id
      if(!userId) return
      let userInfo :any = await this.settingsQuery.getSingleUser('id',userId)
      let check =await Hash.verify(userInfo.password, data.old_password)
      if (!check) {
        return ctx.response.status(401).send({ msg: 'Current password doesn`t match!' })
      }
      data.password=await Hash.make(data.password)
      delete data.old_password
      delete data.password_confirmation
      return this.settingsQuery.changePassword(data, userId)
   }
   public async verifyEmail(ctx:HttpContextContract){
    // let data =  ctx.request.all()
    let number = Math.floor(Math.random() * 899999 + 100000)
    let user :any= ctx.auth.user
    if(user){
      let obj ={
        username: user?.first_name +' '+user?.last_name,
        token:number
      }
      await Mail.send((message) => {
        message
            .from('preranadas97@gmail.com', 'Divine 9')
            .to(user.email)
            .subject('Please confirm your email address')
            .htmlView('emails.verification_emai',  obj)
      })
      let ob = {
        forgot_code : number
      }
      return this.settingsQuery.profileSettingUpdate(ob, user.id)

    }
    return ctx.response.status(200).send({ msg: 'Verification token send successfully!' })
   }

   public async getSingleOgimage(){
     return this.settingsQuery.getSingleOgimage();
   }

};
