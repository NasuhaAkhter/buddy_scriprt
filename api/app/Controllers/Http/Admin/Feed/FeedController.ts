import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FeedService from './FeedService';
import FeedValidator from './FeedValidator';
export default class FeedController {
  private feedService : FeedService
  private feedValidator : FeedValidator

  constructor () {
    this.feedService =  new FeedService()
    this.feedValidator =  new FeedValidator()
  }

  public async getFeedByLimit(ctx: HttpContextContract) {
     return this.feedService.getFeedByLimit(ctx)
  }

  async getSingleFeed(ctx: HttpContextContract){
    return this.feedService.getSingleFeed(ctx)
  }

  async deleteFeed(ctx: HttpContextContract){
    return this.feedService.deleteFeed(ctx)
  }

  //Group-functions
  public async getGroupFeedByLimit(ctx: HttpContextContract) {
     return this.feedService.getGroupFeedByLimit(ctx)
  }

  //Page-functions
  public async getPageFeedWithlimit(ctx: HttpContextContract) {
     return this.feedService.getPageFeedWithlimit(ctx)
  }

  //Event-functions
  public async getEventFeedWithlimit(ctx: HttpContextContract) {
     return this.feedService.getEventFeedWithlimit(ctx)
  }

  //Report-functions
   async getReportWithLimit(ctx: HttpContextContract) {
     return this.feedService.getReportWithLimit(ctx)
  }

  async deleteReport(ctx: HttpContextContract){
    return this.feedService.deleteReport(ctx)
  }

  async deleteContent(ctx: HttpContextContract){
    return this.feedService.deleteContent(ctx)
  }

          //comment-functions
  public async getCommentwithLimit(ctx) {
    return this.feedService.getCommentwithLimit(ctx)
  }

  async deleteComment(ctx: HttpContextContract){
    return this.feedService.deleteComment(ctx)
  }



          //reply-functions
  public async getReplieswithLimit(ctx) {
    return this.feedService.getReplieswithLimit(ctx)
  }

  async deleteReply(ctx: HttpContextContract){
    return this.feedService.deleteReply(ctx)
  }


  async editStaticPages(ctx: HttpContextContract){

    try {
      let vData = await this.feedValidator.validateEditPageSchema(ctx)
      ctx.request.all().id = vData.id
      ctx.request.all().description = vData.description
      return this.feedService.editStaticPages(ctx)
    } catch (error) {
       return ctx.response.status(422).send(error.messages)
    }

   }


   async editOgimage(ctx: HttpContextContract){
     return this.feedService.editOgimage(ctx)
   }

   async getOgimage(){
     return this.feedService.getOgimage()
   }

}
