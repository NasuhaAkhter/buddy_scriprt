import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdQuery from './AdQuery';
import Add from '../../../Models/Add'
import Transection from '../../../Models/Transection'
// import Feed from 'App/Models/Feed';
import TrackAd from 'App/Models/TrackAd';
// const moment = require('moment')
var moment = require('moment');
moment().format();
export default class AdService {
    private adQuery : AdQuery
    constructor(){
      this.adQuery = new AdQuery
    }
    public async getAdByLimit(ctx : HttpContextContract){
      const limit = ctx.request.all().limit
      const user = await this.adQuery.getUserByLimit(limit)
      return user
   }
 
  async stopAd(ctx) {

    try {
      if (!ctx.auth.user || !ctx.auth.user.id)

        return ctx.response.status(401).json({
          message: 'You are not authorized!'
        })
     
    } catch (error) {
      return ctx.response.status(401).json({
        message: 'You are not authorized!'
      })
    }
    let data = ctx.request.all()
    if (!data.user_id || (data.user_id != ctx.auth.user.id)) {
      return ctx.response.status(401).json({
        message: 'You are not authorized!'
      })
    }


    if (!data.id ) {
      return ctx.response.status(401).json({
        message: 'Invalid request!'
      })
    }

    let check_status:any 
   
       check_status = await Add.query()
        .where('id', data.id)
        .where('user_id', ctx.auth.user.id)
        .first()

      // if (check_status != 1) {
      if (!check_status) {
        return ctx.response.status(401).json({
          message: 'Invalid Request Or You Are Not Authorized!'
        })
      }

    let now_date_time =  moment(this.addDayToDateTime(0)).format("YYYY-MM-DD")
      let refund_amount = Number(check_status.budget) - Number(check_status.spending_amount)
    if (refund_amount <= 0 || now_date_time > moment(check_status.end_date_time).format("YYYY-MM-DD")){
      await Add.query()
        .where('user_id', ctx.auth.user.id)
        .where('id', check_status.id)
        .update({
          status: 'Completed'
        })
    }
    else{
     
      await Add.query()
        .where('user_id', ctx.auth.user.id)
        .where('id', check_status.id)
        .update({
          status: 'Stopped'
        })
    }
    
      // page_ad = page_ad.toJSON()

      // input for user_transactions table
      let input_user_transactions = {
        user_id: ctx.auth.user.id,
        amount: refund_amount,
        reason: 'Refund',
        ad_id: check_status.id
      }

       await Transection.create(input_user_transactions)

      // await Notification.sendFixedAdStopedNotification(user, 'Ad stopped successfully.')

      let updatedFixedad = await Add.query().withCount('totalAdImpression', (builder) => {
        builder.where('activity_type', 'impression')
      }).withCount('totalAdClick', (builder) => {
        builder.where('activity_type', 'click')
      }).first();
    return updatedFixedad

  

    
  }
  addDayToDateTime(days) {
    var cDate = new Date();
    var nDate = new Date(cDate.setDate(cDate.getDate() + days));
    let fDate =
      nDate.getFullYear() +
      "-" +
      ((nDate.getMonth() + 1) < 10 ? '0' + (nDate.getMonth() + 1) : (nDate.getMonth() + 1)) +
      "-" +
      (nDate.getDate() < 10 ? '0' + nDate.getDate() : nDate.getDate());

    let today = new Date();
    let time =
      (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) + ":" + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()) + ":" + (today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds());

    // return {added_date_time: fDate}
    console.log('fDate');
    console.log(fDate);
    return fDate + " " + time
  }

  async adRestart(ctx) {
    try {
      if (!ctx.auth.user || !ctx.auth.user.id)
        return ctx.response.status(401).json({
          message: 'You are not authorized!'
        })
    } catch (error) {
      return ctx.response.status(401).json({
        message: 'You are not authorized!'
      })
    }
    let data = ctx.request.all()
    let check = await Add.query()
      .where('id', data.id)
      .where('user_id', ctx.auth.user.id)
      .first()
    // if (check != 1) {
    if (!check) {
      return ctx.response.status(403).json({
        message: 'Invalid Request Or You Are Not Authorized!'
      })
    }
    let tody = this.addDayToDateTime(0)
    if ((tody > moment(check.end_date_time).format("YYYY-MM-DD")) || check.status =='Completed'){
     await Add.query()
        .where('id', data.id)
        .where('user_id', ctx.auth.user.id)
        .update({
          status: 'Completed'
        })
      return ctx.response.status(403).json({
        message: 'You can not restart date is over!'
      })
    }

    let update:any = await Add.query()
      .where('id', data.id)
      .where('user_id', ctx.auth.user.id)
      .update({
        status: 'Running'
      })

    if (update) {
      let updatedFixedad: any = await Add.query().where('id', data.id).withCount('totalAdClick', (builder) => {
        builder
          .where('activity_type', 'click')
      }).withCount('totalAdImpression', (builder) => {
        builder
          .where('activity_type', 'impression')
      }).first();
      // updatedFixedad = updatedFixedad.toJSON();
      let input_user_transactions = {
        user_id: ctx.auth.user.id,
        amount: updatedFixedad.budget ? -updatedFixedad.budget : 0,
        reason: 'Restart ad',
        ad_id: updatedFixedad.id
      }

      // await Notification.sendFixedAdStartedNotification(user, 'Ad restarted successfully.')

      await Transection.create(input_user_transactions)
      
        return updatedFixedad
    
    }


    return ctx.response.status(402).json({
      message: 'ad restart failed'
    })



  }
   getCurrentDateTime() {
    var nDate = new Date();
    let fDate =
      nDate.getFullYear() +
      "-" +
      ((nDate.getMonth() + 1) < 10 ? '0' + (nDate.getMonth() + 1) : (nDate.getMonth() + 1)) +
      "-" +
      (nDate.getDate() < 10 ? '0' + nDate.getDate() : nDate.getDate());
    var today = new Date();
    let time =
      (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) + ":" + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()) + ":" + (today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds());
    return fDate + ' ' + time
  }
  async feedPageAdsStream() {

    let current_date = this.getCurrentDateTime()
    let query = await Add.query()
      .where('start_date_time', '<=', current_date)
      .where('end_date_time', '>=', current_date)
      // .where('user_id', user.id)
      .where('status', 'Running').select('id')
    return query
  }

  // async getFeedPageAds(ctx) {

  
  //   try {
  //   await ctx.auth.user.id
  //   } catch (error) {
  //     console.log(error)
  //     return ctx.response.status(401).json({
  //       message: 'You are not authorized!'
  //     })
  //   }

  //   let ads = await this.feedPageAdsStream()


  //   if (!ads) {
  //     return ctx.response.status(200).json({
  //       ads: []
  //     })
  //   }

  //   return ctx.response.status(200).json({
  //     ads: ads
  //   })
  // }
  async addAdActivity(ctx) {
    // let user:any 

    try {
       await ctx.auth.user.id
    } catch (error) {
      return ctx.response.status(401).json({
        message: 'You are not authorized!'
      })
    }

    if (!ctx.request.body.type || !ctx.request.body.ad_id || !ctx.request.body.user_id || !ctx.request.body.ad_type || !ctx.request.body.activity_type) {
      return ctx.response.status(401).json({
        message: 'Invalid Request'
      })
    }

    if (ctx.request.all().user_id != ctx.auth.user.id) {
      return ctx.response.status(401).json({
        message: 'You are not authorized!'
      })
    }
    // delete
    if (ctx.request.body.type == 2) {
      await TrackAd.query()
        .where('ad_id', ctx.request.body.ad_id)
        .where('user_id', ctx.request.body.user_id)
        .where('activity_type', ctx.request.body.activity_type)
        .delete()

      return {}
    }

   

    // add
    let res = await TrackAd.create({
      ad_id: ctx.request.body.ad_id,
      user_id: ctx.auth.user.id,
      ad_type: ctx.request.body.ad_type,
      activity_type: ctx.request.body.activity_type,
    })


    // send notification
    // await Notification.sendStatusLikeNotification(request.body.more, user)


    return res
  }
  // async  getAddLists(ctx){

  //   let userId: any = ctx.auth.user?.id
  //   let data:any = ctx.request.all()
  //   data.page = data.page?data.page:1
  //   data.limit = data.limit?data.limit:15
  //   return this.adQuery.getAddLists(userId, data.page, data.limit)
  // }
};
