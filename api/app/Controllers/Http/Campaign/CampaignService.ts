import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CampaignQuery from './CampaignQuery';
import CustomHelpers from 'App/Helpers/CustomHelpers';

var moment = require('moment');

export default class CampaignService {
    private campaignQuery : CampaignQuery
    private customHelpers : CustomHelpers
    constructor(){
      this.campaignQuery = new CampaignQuery
      this.customHelpers = new CustomHelpers

    }
    public async getCampaignByLimit(ctx : HttpContextContract){
      const limit = ctx.request.all().limit
      const user = await this.campaignQuery.getUserByLimit(limit)
      return user
   }
   public async getPageByUserId(ctx : HttpContextContract){
    let userId:any = ctx.auth.user?.id
     return await this.campaignQuery.getPageByUserId(userId)
   }
   public async getSingleCampaignDetails(ctx : HttpContextContract){
    // let userId:any = ctx.auth.user?.id
    let data=ctx.request.all()
     return  this.campaignQuery.getSingleCampaignDetails(data.id)
   }
   public async getSingleCampaignEvents(ctx : HttpContextContract){
    // let userId:any = ctx.auth.user?.id
    let data=ctx.request.all()
     return  this.campaignQuery.getSingleCampaignEvents(data.id,data.page)
   }
   public async getCampaignList(ctx : HttpContextContract){
    let userId:any = ctx.auth.user?.id
    let data = ctx.request.all()
    data.page = data.page?data.page:1
    data.limit = data.limit?data.limit:10
     return await this.campaignQuery.getCampaignList(userId, data.page, data.limit)
   }
   public async getFeedByPageId(ctx : HttpContextContract){
    let data=ctx.request.all()
    let feeds =  await this.campaignQuery.getFeedByPageId(data.page_id,data.page_str)

    if(!feeds.length) return feeds;
    let formatFeeds:any  = [];
    for(let d of feeds ){
      if(d.files){
        d.files = JSON.parse(d.files)
        if(d.files.length == 1){
          let ob = {
            'id':d.id,
            'feed_txt':d.feed_txt,
            'files':d.files
          }
          formatFeeds.push(ob)
        }
      }
      else {
        let ob = {
          'id':d.id,
          'feed_txt':d.feed_txt,
          'files': []
        }
        formatFeeds.push(ob);
      }
    }

    return formatFeeds
   }
   public async createCampaign(ctx : HttpContextContract){
    let userId:any = ctx.auth.user?.id
    let data=ctx.request.all()
    data.user_id=userId
    let today = moment().format("YYYY-MM-DD")
    if(data.start_date_time  > today){
      data.status = "Pending"
    }else if(data.start_date_time  == today){
      data.status = "Running"
    }
    let createdData =  await this.campaignQuery.createCampaign(data)
    let newTransactionData = {
      user_id: userId,
      amount: (data.budget) * -1,
      reason: 'Spent on Campaign',
      ad_id: createdData.id
    }
    await this.customHelpers.createUserTransaction(newTransactionData);
    return createdData;

    
   }
  public async updateCampaign(ctx : HttpContextContract){
    let userId:any = ctx.auth.user?.id
    let data=ctx.request.all()
    let today = moment().format("YYYY-MM-DD")
    if(data.start_date_time  > today){
      data.status = "Pending"
    }else if(data.start_date_time  == today){
      data.status = "Running"
    }
    if (!data.user_id || (data.user_id != userId)) {
      return ctx.response.status(401).json({
        message: 'You are not authorized!'
      })
    }
    let adData = await this.campaignQuery.getSingleCampaignDetails(data.id)
    if(!adData) return  ctx.response.status(401).json({
      msg: 'Campaign not found!'
    }) ;
    data.user_id=userId
    let result = await this.campaignQuery.updateCampaign(data, userId)
    if( data.budget > adData.budget  && adData.status == 'Running' ){

        let newTransactionData = {
          user_id: userId,
          amount: (data.budget-adData.budget)* -1,
          reason: 'Spent on Campaign',
          ad_id: data.id
        }

  
         await this.customHelpers.createUserTransaction(newTransactionData);
    }
    else if(data.budget < adData.budget ){

        let newTransactionData = {
          user_id: userId,
          amount: adData.budget-data.budget,
          reason: 'Campaign Refund',
          ad_id: data.id
        }

  
         await this.customHelpers.createUserTransaction(newTransactionData);


    }

    return result;
  }
  public async stopCampaign(ctx : HttpContextContract){
    let userId:any = ctx.auth.user?.id
    
    let data = ctx.request.all()

    if (!data.user_id || (data.user_id != userId)) {
      return ctx.response.status(401).json({
        message: 'You are not authorized!'
      })
    }


    if (!data.id ) {
      return ctx.response.status(401).json({
        message: 'Invalid request!'
      })
    }

    let check_status = await this.campaignQuery.getSingleCampaignDetails(data.id)
    if (!check_status) {
      return ctx.response.status(401).json({
        msg: 'Campaign not found!'
      })
    }

    let now_date_time =  moment(this.customHelpers.addDayToDateTime(0)).format("YYYY-MM-DD")

    let refund_amount = Number(check_status.budget) - Number(check_status.spending_amount)

    if (refund_amount <= 0 || now_date_time > moment(check_status.end_date_time).format("YYYY-MM-DD")){
      await this.customHelpers.addNewCampaignEvent(check_status,userId,'Completed')
    }
    else{
      await this.customHelpers.addNewCampaignEvent(check_status,userId,'Stopped')
    }

      // input for user_transactions table
      let input_user_transactions = {
        user_id: userId,
        amount: refund_amount,
        reason: 'Campaign Refund',
        ad_id: check_status.id
      }
      await this.customHelpers.createUserTransaction(input_user_transactions);

      // await Notification.sendFixedAdStopedNotification(user, 'Ad stopped successfully.')

      let updatedData = await this.campaignQuery.getSingleCampaignDetails(data.id)
      return updatedData
  }
  public async restartCampaign(ctx : HttpContextContract){
    let userId:any = ctx.auth.user?.id
    
    let data = ctx.request.all()

    if (!data.user_id || (data.user_id != userId)) {
      return ctx.response.status(401).json({
        message: 'You are not authorized!'
      })
    }


    if (!data.id ) {
      return ctx.response.status(401).json({
        message: 'Invalid request!'
      })
    }

    let check_status = await this.campaignQuery.getSingleCampaignDetails(data.id)
    if (!check_status) {
      return ctx.response.status(401).json({
        msg: 'Campaign not found!'
      })
    }
    let today = moment().format("YYYY-MM-DD")
    console.log('today',today)
    console.log('end -date',moment(check_status.end_date_time).format("YYYY-MM-DD"))
    if ((today > moment(check_status.end_date_time).format("YYYY-MM-DD"))){
      if(check_status.status !='Completed'){
        this.customHelpers.addNewCampaignEvent(check_status,userId,'Completed')
      }
      return ctx.response.status(401).json({
        msg: 'Campaign already completed!'
      })
    }

    let updateObj = {
      id:check_status.id,
      status:'Running'
    };
    let isUpdated = await this.campaignQuery.updateCampaign(updateObj, userId)
    
    if (!isUpdated) {

      return ctx.response.status(401).json({
        msg: 'Campaign restart failed!'
      })

    }

      let updatedCampaignData: any = await this.campaignQuery.getSingleCampaignDetails(data.id)
      
      let input_user_transactions = {
        user_id: userId,
        amount: (updatedCampaignData.budget) * -1 ,
        reason: 'Spent on Campaign Restart',
        ad_id: updatedCampaignData.id
      }
      await this.customHelpers.createUserTransaction(input_user_transactions);

      return updatedCampaignData
  }

  async eventActionTrack(ctx : HttpContextContract){
    let userId:any = ctx.auth.user?.id
    let data = ctx.request.all()

    if (!data.user_id || (data.user_id != userId)) {
      return ctx.response.status(401).json({
        message: 'You are not authorized!'
      })
    }
      return await this.customHelpers.createAdActionEvent(data.id,userId,data.activity_type,data.ad_type)
  }
};
