import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from './UserService';
import UserValidator from './UserValidator';

// import Database from '@ioc:Adonis/Lucid/Database';
export default class UserController {
  private userService : UserService
  private userValidator : UserValidator

  constructor () {
    this.userService =  new UserService()
    this.userValidator =  new UserValidator()
  }

  async getUserByLimit(ctx: HttpContextContract) : Promise<any>{
      return this.userService.getUserByLimit(ctx)
   }

  async getBlockedUser(ctx: HttpContextContract) : Promise<any>{
      return this.userService.getBlockedUser(ctx)
   }


  async getSingleUser(ctx: HttpContextContract){
      return this.userService.getSingleUser(ctx)
   }

  async deleteUser(ctx: HttpContextContract){
      return this.userService.deleteUser(ctx)
   }

  async removefromAdmin(ctx: HttpContextContract){
      return this.userService.removefromAdmin(ctx)
   }

  async editUser(ctx: HttpContextContract){
      await this.userValidator.validateEditUserSchema(ctx)
      return this.userService.editUser(ctx)
   }

  async editAdminUser(ctx: HttpContextContract){
      // await this.userValidator.validateeditAdminUserSchema(ctx)
      return this.userService.editAdminUser(ctx)
   }

  async editAdminPassword(ctx: HttpContextContract){
      // await this.userValidator.validateeditAdminUserSchema(ctx)
      return this.userService.editAdminPassword(ctx)
   }


  async getUserTrans(ctx: HttpContextContract) : Promise<any>{
      return this.userService.getUserTrans(ctx)
   }

  async updateWallet(ctx: HttpContextContract) : Promise<any>{
      return this.userService.updateWallet(ctx)
   }

}
