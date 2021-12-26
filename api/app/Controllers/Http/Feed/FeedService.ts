import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FeedQuery from './FeedQuery';
import { getLinkPreview } from 'link-preview-js';
import { cuid } from '@ioc:Adonis/Core/Helpers'
// import Application from '@ioc:Adonis/Core/Application'
import CustomHelpers from 'App/Helpers/CustomHelpers';
// const Redis = use('Redis')
import Redis from '@ioc:Adonis/Addons/Redis';
import Event from '@ioc:Adonis/Core/Event'
import Drive from '@ioc:Adonis/Core/Drive'

export default class FeedService {
    private feedQuery : FeedQuery
    private customHelpers : CustomHelpers
    constructor(){
      this.feedQuery = new FeedQuery
      this.customHelpers = new CustomHelpers
    }
    async gettest( ){
      await Redis.set('foo', 'bar')
      const value = await Redis.get('foo')
      return value
    }
    async testAd( ){
      await Redis.set('foo', 'bar')
      const value = await Redis.get('foo')
      return value
    }

    async createReport(vData, ctx : HttpContextContract){
      let data = ctx.request.all();
      delete data.isOpen
      data.user_id = ctx.auth.user?.id;
      data.text = vData.text
      data.feed_id = vData.feed_id
      return this.feedQuery.createReport(data)
    }

    async createFeed(ctx : HttpContextContract){
      let data = ctx.request.all()
      //  let from = data.from
      //  delete data.from
       let userId:any = ctx.auth.user?.id
      data.user_id = userId

      // if(ctx.request.files('images')){
      //   // let images = await this.uploadImage(ctx)
      //   let images = await this.customHelpers.uploadImages3(ctx)
      //   if(images &&  images.length > 0){
      //       data.file_type = images[0].type
      //       data.files = JSON.stringify(images)
      //   }
      // }else{
      //   data.files = null
      // }

      if(ctx.request.files('images')){
        let images:any
        
          images = await this.customHelpers.uploadImages3(ctx)
       
        if(images &&  images.length > 0){
            data.file_type = images[0].type
            data.files = JSON.stringify(images)
        }
      }else{
        data.files = null
      } 

      delete data.uploadType
      let feed:any
      // let requestData = ctx.request.all()
      // return from
      // if(from && from != 'web'){
        // data.meta_data= JSON.stringify(data.meta_data)
      // }
      if(data.page_id){
        delete data.user_id
      }
      feed = await this.feedQuery.createFeed(data)
      // let
      feed.comments = []
      feed.comment_count  = 0
      feed.like_count  = 0
      feed.share_count  = 0
      //feed.like  = null
      
      let feedData = await this.getSingleFeed(feed.id,userId, feed.feed_privacy)

      if(data.share_id && feed){
        this.feedQuery.feedIncrement(data.share_id, 1)
      }
      let notiData = JSON.parse(JSON.stringify(feedData[0]))

      if(notiData && notiData.share && notiData.share.user_id){
        if(userId != notiData.share.user_id){
          let user = ctx.auth.user
          if(!user) return;
          let noti_meta = {
            id : user?.id,
            profile_pic : user?.profile_pic,
            first_name : user?.first_name,
            last_name : user?.last_name,
            action_text: 'shared your post',
          }
          Event.emit('new:notification',
             {
              user_id: notiData.share.user_id,
              from_id: user.id,
              feed_id: notiData.share.id,
              noti_type : 'share_post',
              noti_meta: noti_meta,
              comment_id: undefined,
              other_count: notiData.share.share_count
            }
          )
        }
        return feedData[0]
      }

      return feedData[0]
    }




    async getAdds(ctx : HttpContextContract){
      // console.log("hello from get ads")
      let user:any = ctx.auth.user
      let current_date = this.customHelpers.getOnlyCurrentDate()
       
      return  await this.feedQuery.getAdds(current_date,user,null)
    }
    async getFeed(ctx : HttpContextContract){
      // console.log('hello time1')
      let user:any = ctx.auth.user
      // var start = new Date().getTime();
      let obj = { status : 'Running' }
      let current_date = this.customHelpers.getOnlyCurrentDate()
      this.feedQuery.pendingAdsChecking(current_date, obj)
      let pageAds:any = await Redis.get(`pageAds${user.id}`);
      pageAds = JSON.parse(pageAds)
      if (!pageAds || pageAds.length == 0) {
        // console.log("Redis don't have pageAds ")
        pageAds = [];
        let ads = await this.feedQuery.getAdds(current_date,user,null)
        pageAds = ads
        await Redis.set(`pageAds${user.id}`, JSON.stringify(pageAds))
        await Redis.expire(`pageAds${user.id}`, 86400)
      }
      else console.log("Redis  have pageAds ",pageAds )
      let newFeed:any=null;
      let ob :any= {}
      let  len:number = pageAds.length

      // console.log("Ads",len)
      if (len > 0) {
        let firstRandomIndex = Math.floor(Math.random() * pageAds.length);
        ob = pageAds[firstRandomIndex]
        newFeed  = await this.feedQuery.getSingleAdds(ob.id)
        await this.customHelpers.createAdActionEvent(ob.id, user.id, 'impression','page_ad')
        pageAds.splice(firstRandomIndex,1)
        if (len == 1) {
          pageAds = [];
          let ads = await this.feedQuery.getAdds(current_date,user, null)
          pageAds = ads
          await Redis.set(`pageAds${user.id}`, JSON.stringify(pageAds))
          await Redis.expire(`pageAds${user.id}`, 86400)
        }
        else {
          await Redis.set(`pageAds${user.id}`, JSON.stringify(pageAds))
        }
      }
      // console.log("newFeed on ---------------------------------------------------------------------------- ",newFeed )
      let feedData  = await this.feedQuery.getFeed(ctx.auth.user?.id, ctx.request.all().more,ctx.request.all().feed_type)
      // return feedData
      return this.customHelpers.feedResponse(feedData,newFeed, ctx.auth.user?.id)

    }
    async saveFeedforUser(ctx : HttpContextContract){
      let data = ctx.request.all()
      let user_id =  ctx.auth.user?.id
      let feed  = await this.feedQuery.getFeedInfo(data.feed_id,user_id)
      if(!feed) return ctx.response.status(404).send({msg: "This post has been deleted or you don't have permission to take this action!"})
      return await this.feedQuery.saveFeedforUser({
        feed_id: data.feed_id,
        user_id: user_id
      })
    }
    async unsaveFeedforUser(ctx : HttpContextContract){
      let data = ctx.request.all()
      let user_id =  ctx.auth.user?.id
      let feed  = await this.feedQuery.getFeedInfo(data.feed_id,user_id)
      if(!feed) return ctx.response.status(404).send({msg: "This post has been deleted or you don't have permission to take this action!"})
      return await this.feedQuery.unsaveFeedforUser({
        feed_id: data.feed_id,
        user_id: user_id
      })
    }
    async createLike(ctx : HttpContextContract){
      let data = ctx.request.all()
      data.user_id = ctx.auth.user?.id
      let feed  :any= await this.feedQuery.getFeedInfo(data.feed_id,ctx.auth.user?.id)
      if(!feed) return ctx.response.status(404).send({msg: "This post has been deleted or you don't have permission to take this action!"})
      // check if user has reacted before or not..
      if(feed.like){ // user reacted on this post before...
        feed.like_count--
      }else{
        feed.like_count++
      }
        
      let uid = ctx.auth.user?.id
      
      
      await Promise.all([
        this.feedQuery.deleteOrCreateLike({feed_id : data.feed_id, user_id : uid}, feed.like),
        this.feedQuery.updateFeedLike({like_count : feed.like_count}, data.feed_id)
      ])
      
      let feed_user_like = await this.feedQuery.feedUserLike(data.feed_id ,feed.userId);
      
      // fire notification events
      if(!feed.like && feed.userId != uid){
        let user = ctx.auth.user
        if(!user) return;
        let noti_meta = {
          id : user?.id,
          profile_pic : user?.profile_pic,
          first_name : user?.first_name,
          last_name : user?.last_name,
          action_text: (feed_user_like?.total && feed.like_count >2) || (!feed_user_like?.total && feed.like_count >1)? 'love your post':'loves your post'
        }
        Event.emit('new:notification',
           {
            user_id: feed.userId,
            from_id: user?.id,
            feed_id: feed.id,
            noti_type :'feed_like',
            noti_meta: noti_meta,
            comment_id: undefined,
            other_count: feed.like_count
          }
        )
        }else if(feed.like){
        Event.emit('delete:commentNotification',
        {
            user_id: feed.userId,
            from_id: uid?uid:0,
            feed_id: feed.id,
            comment_id: 0,
            noti_type :'feed_like',
            is_deleted:true
          }
        )
      }
      // if(feed.like && feed.userId != uid ){
      //   let user = ctx.auth.user
      //   if(!user) return;
      //   let noti_meta = {
      //     id : user?.id,
      //     profile_pic : user?.profile_pic,
      //     first_name : user?.first_name,
      //     last_name : user?.last_name,
      //     action_text: (feed_user_like?.total && feed.like_count >2) || (!feed_user_like?.total && feed.like_count >1)? 'love your post':'loves your post'
      //   }
      //   Event.emit('new:notification',
      //      {
      //       user_id: feed.userId,
      //       from_id: user?.id,
      //       feed_id: feed.id,
      //       noti_type :'feed_unlike',
      //       noti_meta: noti_meta,
      //       comment_id: undefined,
      //       other_count: feed.like_count
      //     }
      //   )
      // }
      return feed.like_count
    }

    async getLinkPreview(data){
        try {
          let info = await getLinkPreview(`${data.url}`)
          return {
             success: true,
             metaData : info
          }
        } catch (error) {
          return {
            success: false,
            metaData : null
         }
        }
    }
    async uploadImage(ctx) {
       const images = ctx.request.files('images')
      let uploadedImages : any[] = []
      for (let image of images) {
        const fileName = `${cuid()}.${image.extname}`
        // await image.move(Application.publicPath('uploads'),{
        //   name: fileName,
        // })
        // let d= await  Drive.getSignedUrl('cdn')
        
       await image.move(await  Drive.getUrl('cdn'),{
          name: fileName,
        }) 
        let imgObj = {
          //  fileLoc : process.env.UPLOAD_URL+ '/uploads/'+fileName,
          //  fileLoc : 'https://cdn.socialnetworkstage.com/cdn/'+fileName,
           fileLoc : process.env.UPLOAD_URL+fileName,
           originalName: image.clientName,
           extname: image.extname,
           size: image.size,
           type:  ctx.request.all().uploadType
        }
        uploadedImages.push(imgObj)
      }
      return uploadedImages
    }
    
    async getSingleFeed(id,uid, privacy){
      let feedData  = await this.feedQuery.getSingleFeed(id,uid, privacy)
      return this.customHelpers.feedResponse(feedData,null, uid)
    }
    
    async updateFeed(ctx : HttpContextContract){
      let data = ctx.request.all()
      delete data.share_id
      let allFiles : any = []
      // if user has uploaded new images..
      // if(ctx.request.files('images')){
      //   // let images = await this.uploadImage(ctx) // upload image in folder
      //   let images = await this.customHelpers.uploadImages3(ctx)
      //   if(images.length > 0){
      //       allFiles = images // adding file to the array if user upload a new one
      //   }
      // }

    if(ctx.request.files('images')){
        let images:any
        
          images = await this.customHelpers.uploadImages3(ctx)
        if(images &&  images.length > 0){
            // data.file_type = images[0].type
            allFiles = images
        }
      }else{
        data.files = null
      }


      if(data.old_files){ // add old file
          let oldFiles = JSON.parse(data.old_files)
          for(let d of oldFiles){
            allFiles.push(d)
          }
      }
      // stringify all files
      data.file_type = allFiles.length ? allFiles[0].type : null
      data.files = allFiles.length ? JSON.stringify(allFiles) : null
      // data.meta_data= JSON.stringify(data.meta_data)
      delete data.old_files
      delete data.uploadType
      
      if(data.page_id){
        delete data.user_id
      }
      return this.feedQuery.updateFeed(data)

    }
    
    
    async deleteFeed(ctx : HttpContextContract){
      let data = ctx.request.all()
      let uid = ctx.auth.user?.id
      if(data.user_id ==uid){
        let feed = await this.feedQuery.deleteFeed(data.id)
        if(data.share_id && feed){
          this.feedQuery.feedIncrement(data.share_id, -1)
        }
        return feed;
      }
      return  ctx.response.status(422).send({message:"Invalid request"})
    }

};
