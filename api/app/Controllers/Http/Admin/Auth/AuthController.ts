import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from './AuthService';
import AuthValidator from './AuthValidator';

// import Database from '@ioc:Adonis/Lucid/Database';
export default class AuthController {
  private authService : AuthService
  private authValidator : AuthValidator
  
  constructor () {
    this.authService =  new AuthService()
    this.authValidator =  new AuthValidator()
  }

  async login(ctx : HttpContextContract){
      // return ctx.request.all();
      await this.authValidator.validateLoginSchema(ctx)
      return this.authService.loginAdmin(ctx)
      // return await ctx.auth.use("web").attempt(data.email, data.password)
      // return await ctx.auth.query(function (query) { query.where('is_active', true) }).use("web").attempt(data.email, data.password)
   }


}
