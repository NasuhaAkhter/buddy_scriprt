
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserQuery from './UserQuery';
import CommonService from '../../Common/commonService';
import Hash from '@ioc:Adonis/Core/Hash'

export default class UserService {
    private userQuery : UserQuery
    private commonService : CommonService

    constructor(){
      this.userQuery = new UserQuery
      this.commonService = new CommonService
    }

    public async getUserByLimit(ctx :HttpContextContract): Promise<any>{
      let data = ctx.request.all()
      let fData = await this.commonService.formatedData(data)

      let user =await this.userQuery.getUserByLimit(fData)
      let userCount = await this.userQuery.userCount()
      return ctx.response.json({ user, userCount})

    }

    public async getBlockedUser(ctx :HttpContextContract): Promise<any>{
      let data = ctx.request.all()
      let fData = await this.commonService.formatedData(data)

      let user =await this.userQuery.getBlockedUser(fData)
      let userCount = await this.userQuery.blockedUserCount()
      return ctx.response.json({ user, userCount})

    }


    public async getSingleUser(ctx): Promise<any>{
      let id = ctx.params.id
        let user :any = await this.userQuery.getSingleUser('id',id)
        if(user && user.work_data){
          user.work_data =JSON.parse(user.work_data)
        }
        return user
    }

    public async deleteUser(ctx :HttpContextContract) : Promise<any>{
      let data = ctx.request.all()
      let auth :any= await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.admin_id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }

      return this.userQuery.deleteUser('id',data.uId)

    }

    public async removefromAdmin(ctx :HttpContextContract) : Promise<any>{
      let data = ctx.request.all()
      let auth :any= await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.admin_id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }
      delete ctx.request.all().admin_id
      return this.userQuery.removefromAdmin(ctx)

    }

    public async editUser(ctx :HttpContextContract) : Promise<any>{
      let data = ctx.request.all()
      let auth :any= await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.admin_id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }
      delete data.admin_id

      return this.userQuery.editUser(data)

    }

    public async editAdminUser(ctx :HttpContextContract) : Promise<any>{
      let data = ctx.request.all()
      let auth :any= await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }
      let user :any = await this.userQuery.checkUser(auth.id, data.email)

      if(user){
        return ctx.response.status(401).send({ message: 'Email must be unique!' })
      }

      return this.userQuery.editAdminUser('id',data.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
      })

    }

    public async editAdminPassword(ctx :HttpContextContract) : Promise<any>{
      let data = ctx.request.all()
      let auth :any= await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }

      let userInfo :any = await this.userQuery.getSingleUser('id',data.id)

      let check =await Hash.verify(userInfo.password, data.currentPassword)
      if (!check) {
        return ctx.response.status(401).send({ message: 'Current password doesn`t match!' })
      }

      return this.userQuery.editAdminUser('id',data.id, {
        password: await Hash.make(data.newPassword),
      })

    }

    //user-transactions
    public async getUserTrans(ctx :HttpContextContract): Promise<any>{
      let data = ctx.request.all()
      let fData = await this.commonService.formatedData(data)

      let user =await this.userQuery.getUserTrans(fData)
      let userCount = await this.userQuery.transCount()
      return ctx.response.json({ user, userCount})

    }

    public async updateWallet(ctx :HttpContextContract): Promise<any>{
      let data = ctx.request.all()
      if(!data.amount){
        return ctx.response.status(401).send({message: 'Ammount is requird.'})
      }
      return this.userQuery.updateWallet(ctx)

    }




};
