import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ChattingService from './ChattingService';
// import ChattingValidator from './ChattingValidator';
export default class ChattingController {
  private chattingService : ChattingService
  // private chattingValidator : ChattingValidator
  constructor () {
    this.chattingService =  new ChattingService()
    // this.chattingValidator =  new ChattingValidator()
  }
  public async insertChat(ctx : HttpContextContract) {
    return this.chattingService.insertChat(ctx)
  }
  public async getChatLists(ctx : HttpContextContract) {
    return this.chattingService.getChatLists(ctx)
  }
  public async getInbox(ctx : HttpContextContract) {
    return this.chattingService.getInbox(ctx)
  }
  public async updateSeen(ctx : HttpContextContract) {
    return this.chattingService.updateSeen(ctx)
  }
  public async deleteSingleMsg(ctx : HttpContextContract) {
    return this.chattingService.deleteSingleMsg(ctx)
  }
  public async deleteFullConvers(ctx : HttpContextContract) {
    return this.chattingService.deleteFullConvers(ctx)
  }
}
