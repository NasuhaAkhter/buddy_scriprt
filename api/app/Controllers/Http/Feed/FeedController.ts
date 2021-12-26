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
  async gettest(){
    return this.feedService.gettest()
  }
  async createReport(ctx : HttpContextContract){
    try {
      let vData = await this.feedValidator.createReportValidate(ctx)
      return this.feedService.createReport(vData, ctx)
    } catch (error) {
       return ctx.response.status(422).send(error.messages)
    }
  }
  async createFeed(ctx : HttpContextContract){
    try {
       await this.feedValidator.createFeedValidate(ctx)
      return this.feedService.createFeed(ctx)
    } catch (error) {
       return ctx.response.status(422).send(error.messages)
    }
  }
  
  async deleteFeed(ctx : HttpContextContract){
    await this.feedValidator.deleteFeedValidate(ctx)
    return this.feedService.deleteFeed(ctx)
  }
  async updateFeed(ctx : HttpContextContract){
    await this.feedValidator.createFeedValidate(ctx)
    return this.feedService.updateFeed(ctx)
  }
  async getFeed(ctx : HttpContextContract){
      return this.feedService.getFeed(ctx)
  }
  async getAdds(ctx : HttpContextContract){
      return this.feedService.getAdds(ctx)
  }
  async createLike(ctx : HttpContextContract){
     await this.feedValidator.feedLikeValidator(ctx)
     return this.feedService.createLike(ctx)
  }
  async saveFeedforUser(ctx : HttpContextContract){
     await this.feedValidator.feedSaveValidator(ctx)
     return this.feedService.saveFeedforUser(ctx)
  }
  async unsaveFeedforUser(ctx : HttpContextContract){
     await this.feedValidator.feedSaveValidator(ctx)
     return this.feedService.unsaveFeedforUser(ctx)
  }
  async getLinkPreview({request} : HttpContextContract){
    return this.feedService.getLinkPreview(request.all())
  }
  async uploadImage(ctx : HttpContextContract){
    return this.feedService.uploadImage(ctx)
  }
  async getSingleFeed(ctx : HttpContextContract){
    let privacy =ctx.request.all().privacy?ctx.request.all().privacy:''
    return this.feedService.getSingleFeed(ctx.params.id,ctx.auth.user?.id, privacy)
  }
  
}
