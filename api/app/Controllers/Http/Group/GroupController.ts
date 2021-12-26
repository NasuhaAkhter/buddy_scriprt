import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GroupService from './GroupService';
import GroupValidator from './GroupValidator';
export default class GroupController {
  private groupService : GroupService
  private groupValidator : GroupValidator
  constructor () {
    this.groupService =  new GroupService()
    this.groupValidator =  new GroupValidator()
  }
 
  public async removeGroup(ctx : HttpContextContract){
    return this.groupService.removeGroup(ctx)
  }
  public async makeAdmin(ctx : HttpContextContract){
    return this.groupService.makeAdmin(ctx)
  }
  public async removeAdminRole(ctx : HttpContextContract){
    return this.groupService.removeAdminRole(ctx)
  }
  public async getGroupList(ctx : HttpContextContract) {
     return this.groupService.getGroupList(ctx)
  }
  public async leaveGroup(ctx : HttpContextContract) {
     return this.groupService.leaveGroup(ctx)
  }
  public async joinGroup(ctx : HttpContextContract) {
     return this.groupService.joinGroup(ctx)
  }
  public async deleteGroup(ctx : HttpContextContract) {
   try {
      let vaidateData =await this.groupValidator.validateDeleteGroupSchema(ctx)
      let data = ctx.request.all()
      data.group_id =vaidateData.group_id
     return this.groupService.deleteGroup(ctx)
    } catch (error) {
      return ctx.response.status(422).send(error.messages)
    }
     
  }
  public async globalSearch(ctx : HttpContextContract) {
     return this.groupService.globalSearch(ctx)
  }
  public async getSavedPagebyLimit(ctx : HttpContextContract) {
     return this.groupService.getSavedPagebyLimit(ctx)
  }
  public async getSingleGroup(ctx : HttpContextContract) {
    // await this.groupValidator.validateGroupSchema(ctx)
    return this.groupService.getSingleGroup(ctx)
  }
  public async getCategory() {
     return this.groupService.getAllCategory()
  }
  public async getSearchFriend(ctx : HttpContextContract) {
     return this.groupService.getSearchFriend(ctx)
  }
  public async getFriendNotGroupMember(ctx : HttpContextContract) {
     return this.groupService.getFriendNotGroupMember(ctx)
  }
  public async storeGroup(ctx : HttpContextContract) {
    await this.groupValidator.validateGroupDataSchema(ctx)
    return this.groupService.storeGroup(ctx)
  }
  public async updateGroup(ctx : HttpContextContract) {
    await this.groupValidator.validateGroupDataSchema(ctx)
    return this.groupService.updateGroup(ctx)
  }
  public async addMember(ctx : HttpContextContract) {
    await this.groupValidator.validateAddMemberData(ctx)
    return this.groupService.addMember(ctx)
  }
  public async uploadGroupPic(ctx : HttpContextContract) {
     return this.groupService.uploadGroupPic(ctx)
  }

}
