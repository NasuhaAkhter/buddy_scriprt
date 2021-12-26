import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdService from './AdService';
// import AdValidator from './AdValidator';
export default class AdController {
  private adService : AdService
  // private adValidator : AdValidator

  constructor () {
    this.adService =  new AdService()
    // this.adValidator =  new AdValidator()
  }

  public async getMyAdByLimit(ctx: HttpContextContract) {
     return this.adService.getMyAdByLimit(ctx)
  }

 async deleteAd(ctx: HttpContextContract){
  return this.adService.deleteAd(ctx)
}

 async addAnnouncement(ctx: HttpContextContract){
  return this.adService.addAnnouncement(ctx)
}

 async getActiveAnnouncement(){
  return this.adService.getActiveAnnouncement()
}

 async removeActiveAnnounce(ctx: HttpContextContract){
  return this.adService.removeActiveAnnounce(ctx)
}

 async getAllAnnounce(ctx: HttpContextContract){
  return this.adService.getAllAnnounce(ctx)
}

 async deleteAnnouncement(ctx: HttpContextContract){
  return this.adService.deleteAnnouncement(ctx)
 }


}
