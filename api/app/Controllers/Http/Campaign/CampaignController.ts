import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CampaignService from './CampaignService';
import CampaignValidator from './CampaignValidator';
export default class CampaignController {
  private campaignService : CampaignService
  private campaignValidator : CampaignValidator
  constructor () {
    this.campaignService =  new CampaignService()
    this.campaignValidator =  new CampaignValidator()
  }
  public async getCampaignByLimit(ctx : HttpContextContract) {
    await this.campaignValidator.validateCampaignSchema(ctx)
    return this.campaignService.getCampaignByLimit(ctx)
  }
  public async getPageByUserId(ctx : HttpContextContract) {
    return this.campaignService.getPageByUserId(ctx)
  }
  public async getSingleCampaignDetails(ctx : HttpContextContract) {
    return this.campaignService.getSingleCampaignDetails(ctx)
  }
  public async getSingleCampaignEvents(ctx : HttpContextContract) {
    return this.campaignService.getSingleCampaignEvents(ctx)
  }
  public async getCampaignList(ctx : HttpContextContract) {
    return this.campaignService.getCampaignList(ctx)
  }
  public async getFeedByPageId(ctx : HttpContextContract) {
    return this.campaignService.getFeedByPageId(ctx)
  }

  async createCampaign(ctx : HttpContextContract){
    await this.campaignValidator.validateCreateCampaignSchema(ctx)
    return this.campaignService.createCampaign(ctx)
  }
  async updateCampaign(ctx : HttpContextContract){
    await this.campaignValidator.validateCreateCampaignSchema(ctx)
    return this.campaignService.updateCampaign(ctx)
  }
  async restartCampaign(ctx : HttpContextContract){
    await this.campaignValidator.validateCreateCampaignSchema(ctx)
    return this.campaignService.restartCampaign(ctx)
  }
  async stopCampaign(ctx : HttpContextContract){
    await this.campaignValidator.validateCreateCampaignSchema(ctx)
    return this.campaignService.stopCampaign(ctx)
  }
  async eventActionTrack(ctx : HttpContextContract){
    return this.campaignService.eventActionTrack(ctx)
  }
}
