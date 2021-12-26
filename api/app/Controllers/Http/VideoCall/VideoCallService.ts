import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoCallQuery from './VideoCallQuery';
// import CustomHelpers from 'App/Helpers/CustomHelpers';

// var moment = require('moment');

export default class CampaignService {
    private videoCallQuery : VideoCallQuery
    // private customHelpers : CustomHelpers
    constructor(){
      this.videoCallQuery = new VideoCallQuery
      // this.customHelpers = new CustomHelpers

    }
    public async getCallerInformation(ctx : HttpContextContract){
      const user_id = ctx.request.all().user_id
      const user = await this.videoCallQuery.getCallerInformation(user_id)
      return user
   }
};
