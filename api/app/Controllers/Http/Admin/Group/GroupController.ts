import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GroupService from './GroupService';
// import GroupValidator from './GroupValidator';
export default class GroupController {
  private groupService : GroupService
  // private groupValidator : GroupValidator
  
  constructor () {
    this.groupService =  new GroupService()
    // this.groupValidator =  new GroupValidator()
  }

  public async getMyGroupByLimit(ctx: HttpContextContract) {
     return this.groupService.getMyGroupByLimit(ctx)
  }
     
  async getSingleGroup(ctx: HttpContextContract){
    return this.groupService.getSingleGroup(ctx)
 }
 
 async deleteGroup(ctx: HttpContextContract){
  return this.groupService.deleteGroup(ctx)
}
  

}
