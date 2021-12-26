import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FeedQuery from './FeedQuery';
import CommonService from '../../Common/commonService';

export default class FeedService {
    private feedQuery : FeedQuery
    private commonService : CommonService


    constructor(){
      this.feedQuery = new FeedQuery
      this.commonService = new CommonService
    }

    public async getFeedByLimit(ctx: HttpContextContract) : Promise<any>{
      let data = ctx.request.all()
      let user_id = data.user_id?data.user_id:0;
      let page_id = data.page_id?data.page_id:0;
      let event_id = data.event_id?data.event_id:0;
      let group_id = data.group_id?data.group_id:0;
      let fData = await this.commonService.formatedData(data)
      const feed = await this.feedQuery.getFeedByLimit(fData, user_id, page_id, event_id, group_id)
      const feedCount = await this.feedQuery.feedCount(user_id, page_id, event_id, group_id)
      return ctx.response.send({ feed, feedCount})
    }

   public async getSingleFeed(ctx: HttpContextContract): Promise<any>{
      let id = ctx.params.id
      let user = await ctx.auth.use('web').authenticate()
      let feed :any = await this.feedQuery.getSingleFeed('id', id, user?.id)
      if(feed){
        feed.files = feed.files ? JSON.parse(feed.files) : []
        feed.comments = []
        feed.meta_data = JSON.parse(feed.meta_data)
        if(feed.share && feed.share.files){
          feed.share.files = JSON.parse(feed.share.files)
        }
        if(feed.share && feed.meta_data){
          feed.share.meta_data = JSON.parse(feed.share.meta_data)
        }

        if(feed.share){

          if (feed.share.activity_type == 'page'){
             feed.share.name = feed.share.page.page_name
             feed.share.url = `/page/${feed.share.page.slug}/feed`
             feed.share.pic = feed.share.page.profile_pic
             feed.share.uid = feed.share.page.user_id
             feed.share.slug = feed.share.page.slug
          }
          else if (feed.share.activity_type == 'group'){
            feed.share.name = feed.share.group.group_name
            feed.share.url = `/group/${feed.share.group.slug}/feed`
            feed.share.pic = feed.share.group.profile_pic
            feed.share.slug = feed.share.group.slug
            feed.share.feed_from = 'group'
          }
          else if (feed.share.activity_type == 'event'){
            feed.share.name = feed.share.event.event_name
            feed.share.url = `/events/${feed.share.event.slug}/feed`
            feed.share.pic =  feed.share.event.cover
            feed.share.uid = feed.share.event?.user_id
            feed.share.slug = feed.share.event.slug
          }

          else {
             if(feed.share.user){
                feed.share.name = `${feed.share.user.first_name} ${feed.share.user.last_name}`
                feed.share.url = `/profile/${feed.share.user.username}/feed`
                feed.share.pic = feed.share.user.profile_pic
                feed.share.uid = feed.share.user.id
                feed.share.slug = feed.share.user.username
             }
          }


          feed.share.group =null
          feed.share.page =null
          feed.share.event =null
        }

      }
      return feed
  }

  public async deleteFeed(ctx :HttpContextContract) : Promise<any>{
    let data = ctx.request.all()
    let check :any= await ctx.auth.use('web').authenticate()
    if(!check || check.id !=data.admin_id || check.userType != 1){
      return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
    }

    return this.feedQuery.deleteFeed('id',data.feedId)

  }



    //Group-functions
  public async getGroupFeedByLimit(ctx: HttpContextContract) : Promise<any>{
    let data = ctx.request.all()
    let groupId =data.group_id ? data.group_id: 0
    let fData = await this.commonService.formatedData(data)
    const feed = await this.feedQuery.getGroupFeedByLimit(fData, groupId)
    const feedCount = await this.feedQuery.groupFeedCount()
    return ctx.response.send({feed, feedCount})
  }


    //Page-functions
  public async getPageFeedWithlimit(ctx: HttpContextContract) : Promise<any>{
    let data = ctx.request.all()
    let fData = await this.commonService.formatedData(data)
    const feed = await this.feedQuery.getPageFeedWithlimit(fData)
    const feedCount = await this.feedQuery.pageFeedCount()
    return ctx.response.send({feed, feedCount})
  }

    //Event-functions
  public async getEventFeedWithlimit(ctx: HttpContextContract) : Promise<any>{
    let data = ctx.request.all()
    let fData = await this.commonService.formatedData(data)
    const feed = await this.feedQuery.getEventFeedWithlimit(fData)
    const feedCount = await this.feedQuery.eventFeedCount()
    return ctx.response.send({feed, feedCount})
  }

    //Report-functions
  public async getReportWithLimit(ctx: HttpContextContract) : Promise<any>{
    let data = ctx.request.all()
    let fData = await this.commonService.formatedData(data)
    const feed = await this.feedQuery.getReportWithLimit(fData)
    const feedCount = await this.feedQuery.reportCount()
    return ctx.response.send({feed, feedCount})
  }


   async deleteReport(ctx :HttpContextContract) : Promise<any>{
    let data = ctx.request.all()

    let check :any= await ctx.auth.use('web').authenticate()
    if(!check || check.id !=data.admin_id || check.userType != 1){
      return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
    }

    return this.feedQuery.deleteReport('id',data.reportId)

  }

   async deleteContent(ctx :HttpContextContract) : Promise<any>{
    let data = ctx.request.all()
    let check :any= await ctx.auth.use('web').authenticate()
    if(!check || check.userType != 1){
      return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
    }

    return this.feedQuery.deleteContent(data)

  }

    //comment-functions
  public async getCommentwithLimit(ctx: HttpContextContract){
    let lastId = parseInt(ctx.request.all().lastId);
    let user = await ctx.auth.use('web').authenticate()
    const commentData = await this.feedQuery.getCommentwithLimit(ctx.params.id, lastId, user.id)
      for(let d of commentData){
        d.replies = []
      }
   return commentData
  }

  public async deleteComment(ctx :HttpContextContract) : Promise<any>{
    let data = ctx.request.all()

    let check :any= await ctx.auth.use('web').authenticate()
    if(!check || check.id !=data.admin_id || check.userType != 1){
      return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
    }

    let comment = await this.feedQuery.deleteComment('id',data.commentId)
    if(comment){
      return this.feedQuery.decCount(data.feed_id)
    }

  }


    //replies-functions
  public async getReplieswithLimit(ctx: HttpContextContract){
    let lastId = parseInt(ctx.request.all().lastId);
    let user = await ctx.auth.use('web').authenticate()
    const replyData = await this.feedQuery.getReplieswithLimit(ctx.params.id, lastId, user.id)
    return replyData
  }

  public async deleteReply(ctx :HttpContextContract) : Promise<any>{
    let data = ctx.request.all()
    let check :any= await ctx.auth.use('web').authenticate()
    if(!check || check.id !=data.admin_id || check.userType != 1){
      return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
    }

    let comment = await this.feedQuery.deleteReply('id',data.replyId)

    if(comment){
      return this.feedQuery.decCommentCount( data.parentId)
    }

  }

  public async editStaticPages(ctx){
    return this.feedQuery.editStaticPages(ctx);
  }


  public async editOgimage(ctx){
    return this.feedQuery.editOgimage(ctx)
  }

  public async getOgimage(){
    return this.feedQuery.getOgimage()
  }





};
