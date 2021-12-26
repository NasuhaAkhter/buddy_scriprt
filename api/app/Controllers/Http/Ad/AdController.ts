import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdService from './AdService';
// import AdValidator from './AdValidator';
export default class AdController {
  private adService: AdService
  // private adValidator : AdValidator
  constructor () {
    this.adService =  new AdService()
    // this.adValidator =  new AdValidator()
  }
  // public async getAdByLimit(ctx : HttpContextContract) {
  //   await this.adValidator.validateAdSchema(ctx)
  //   return this.adService.getAdByLimit(ctx)
  // }
  async stopAd(ctx: HttpContextContract) {
    return this.adService.stopAd(ctx)
  }
  async adRestart(ctx: HttpContextContract) {
    return this.adService.adRestart(ctx)
  }
  
  // async addAd(ctx: HttpContextContract) {
  //   return this.adService.addAd(ctx)
  // }
  // async getAddLists(ctx: HttpContextContract) {
   
  //   return this.adService.getAddLists(ctx)
  // }
}
