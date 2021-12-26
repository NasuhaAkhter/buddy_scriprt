import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoCallService from './VideoCallService';
// import VideoCallValidator from './VideoCallValidator';
export default class CampaignController {
  private videoCallService : VideoCallService
  // private videoCallValidator : VideoCallValidator
  constructor () {
    this.videoCallService =  new VideoCallService()
    // this.videoCallValidator =  new VideoCallValidator()
  }
  public async getCallerInformation(ctx : HttpContextContract) {
    return this.videoCallService.getCallerInformation(ctx)
  }
 
}
