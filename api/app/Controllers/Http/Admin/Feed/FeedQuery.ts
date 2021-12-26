
import Feed from '../../../../Models/Feed'
import Report from '../../../../Models/Report'
import Comment from '../../../../Models/Comment'
import User from 'App/Models/User';
import Group from 'App/Models/Group';
import Page from 'App/Models/Page';
import Event from 'App/Models/Event';
import StaticPage from 'App/Models/StaticPage';
import Ogimage from 'App/Models/Ogimage';

export default class FeedQuery{

    public async getFeedByLimit(data :any, uId, pId, eId, gId){

        let str  =data.str;
        let q = Feed.query().orderBy(data.colName, data.order)
        .select('id','user_id','page_id','group_id','event_id', 'feed_privacy','activity_type','like_count','comment_count', 'share_count','created_at')
        if(str){
            q.where((query) => {
              query.whereRaw("feed_privacy  LIKE '%" + str + "%'")
              query.orWhereRaw("created_at  LIKE '%" + str + "%'")
            }).orWhereHas('user', (builder) => {
              builder.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
            })
        }
        if(uId){
          q.where('user_id', uId)
        }
        else if(pId){
          q.where('page_id', pId)
        }
        else if(eId){
          q.where('event_id', eId).preload('event')
        }
        else if(gId){
          q.where('group_id', gId)
        }
        let feed = q.preload('user', (query) => {
            query.select('id','first_name','last_name')
          }).paginate(data.page, data.pageSize);
        return feed;
    }

    feedCount(uId, pId, eId, gId){
      if(uId){
        return Feed.query().pojo<{ total: number }>().where('user_id', uId).count('id as total').first()
      }
      else if(pId){
        return Feed.query().pojo<{ total: number }>().where('page_id', pId).count('id as total').first()
      }
      else if(eId){
        return Feed.query().pojo<{ total: number }>().where('event_id', eId).count('id as total').first()
      }
      else if(gId){
        return Feed.query().pojo<{ total: number }>().where('group_id', gId).count('id as total').first()
      }

    }


    getSingleFeed(key, value, uid){
        return Feed.query().where(key, value).orderBy('id', 'desc')
        .preload('user', (query) => {
            query.select('id', 'first_name', 'last_name', 'profile_pic')
        }).preload('page', (q)=>{
          q.select('id', 'page_name','user_id', 'slug', 'profile_pic')
        }).preload('event', (q)=>{
          q.select('id', 'event_name','user_id', 'slug', 'cover')
        })
        .preload('group', (q)=>{
          q.select('id', 'group_name', 'slug', 'profile_pic')
        }).preload('share', (s)=>{
          s.preload('user', (query) => {
            query.select('id', 'first_name', 'last_name', 'profile_pic')
          })
          s.preload('page', (q)=>{
            q.select('id', 'page_name','user_id', 'slug', 'profile_pic')
          })
          s.preload('event', (q)=>{
            q.select('id', 'event_name','user_id', 'slug', 'cover')
          })
          s.preload('group', (q)=>{
            q.select('id', 'group_name', 'slug', 'profile_pic')
          })
        })
        .preload('like', (b) => {
            b.where('user_id', uid)
        }).first()
    }

    deleteFeed(key, value){
        return Feed.query().where(key, value).delete();
    }


    //Group-functions
    public async getGroupFeedByLimit(data :any, groupId){
      let str  =data.str;
      let q = Feed.query().whereNotNull('group_id').orderBy(data.colName, data.order)
      .select('id','user_id', 'group_id', 'feed_privacy', 'like_count','comment_count', 'share_count','created_at')
      if(str){
          q.where((query) => {
            query.whereRaw("feed_privacy  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          }).orWhereHas('user', (builder) => {
            builder.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
            builder.orWhereRaw("last_name  LIKE '%" + str + "%'")
        })
      }
      if(groupId){
        q.where('group_id', groupId)
      }
      let feed = q.preload('user', (query) => {
          query.select('first_name','last_name')
        }).paginate(data.page, data.pageSize);
      return feed;
   }

   groupFeedCount(){
    return Feed.query().pojo<{ total: number }>().whereNotNull('group_id').count('id as total').first()
   }

    //Page-functions
    public async getPageFeedWithlimit(data :any){
      let str  =data.str;
      let q = Feed.query().whereNotNull('page_id').orderBy(data.colName, data.order)
      .select('id','user_id', 'feed_privacy', 'like_count','comment_count', 'share_count','created_at')
      if(str){
          q.where((query) => {
            query.whereRaw("feed_privacy  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          }).orWhereHas('user', (builder) => {
            builder.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
            builder.orWhereRaw("last_name  LIKE '%" + str + "%'")
        })
      }
      if(data.page_id){
        q.where('page_id', data.page_id)
      }
      let feed = q.preload('user', (query) => {
          query.select('first_name','last_name')
        }).paginate(data.page, data.pageSize);
      return feed;
   }

   pageFeedCount(){
    return Feed.query().pojo<{ total: number }>().whereNotNull('page_id').count('id as total').first()
   }

    //Event-functions
    public async getEventFeedWithlimit(data :any){
      let str  =data.str;
      let q = Feed.query().whereNotNull('event_id').orderBy(data.colName, data.order)
      .select('id','user_id', 'feed_privacy', 'like_count','comment_count', 'share_count','created_at')
      if(str){
          q.where((query) => {
            query.whereRaw("feed_privacy  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          }).orWhereHas('user', (builder) => {
            builder.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
            builder.orWhereRaw("last_name  LIKE '%" + str + "%'")
        })
      }
      if(data.event_id){
        q.where('event_id', data.event_id)
      }
      let feed = q.preload('user', (query) => {
          query.select('first_name','last_name')
        }).paginate(data.page, data.pageSize);
      return feed;
   }

    //Report-functions
    public async getReportWithLimit(data :any){
      let str  = data.str;
      let model = Report;
      let q = model.query().orderBy(data.colName, data.order)
      if(str){
          q.where((query) => {
            query.whereRaw("text  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          }).orWhereHas('user', (builder) => {
            builder.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
        })
      }
      if(data.event_id){
        q.where('event_id', data.event_id)
      }
      let feed = q.preload('user').paginate(data.page, data.pageSize);
      return feed;
   }

   eventFeedCount(){
    return Feed.query().pojo<{ total: number }>().whereNotNull('event_id').count('id as total').first()
   }
   reportCount(){
    return Report.query().pojo<{ total: number }>().count('id as total').first()
   }



    //comment-functions

    public async getCommentwithLimit(feedId, lastId, uid){
    let query =  Comment.query().where('feed_id', feedId).whereNull('parrent_id').orderBy('id', 'desc').limit(10)
      .preload('user', (a) => {
        a.select('id', 'first_name', 'last_name', 'profile_pic')
      }).preload('commentlike', (b) => {
        b.where('user_id', uid)
      })
      if(lastId > 0){
        return query.where('id', '<', lastId)
      }
      return query
    }

    deleteComment(key, value){
        return Comment.query().where(key, value).delete();
    }

    deleteReport(key, value){
        return Report.query().where(key, value).delete();
    }

    async deleteContent(data){
        let value = data.value
        await Report.query().where('id', data.id).delete();
        if(value == "Feed"){
         return Feed.query().where('id', data.cid).delete();
        }
        if(value == "Profile"){
         return User.query().where('id', data.cid).delete();
        }
        if(value == "Group"){
         return Group.query().where('id', data.cid).delete();
        }
        if(value == "Page"){
         return Page.query().where('id', data.cid).delete();
        }
        if(value == "Event"){
         return Event.query().where('id', data.cid).delete();
        }
        if(value == "Comment"){
         return Comment.query().where('id', data.cid).delete();
        }



    }

    decCount(feed_id){
         return Feed.query().where('id', feed_id).decrement('comment_count', 1)
    }




    //reply-functions

    public async getReplieswithLimit(parrentId, lastId, uid){
     let query =  Comment.query().where('parrent_id', parrentId).orderBy('id', 'desc').limit(10)
     .preload('user', (a) => {
        a.select('id', 'first_name', 'last_name', 'profile_pic')
      }).preload('commentlike', (b) => {
        b.where('user_id', uid)
      })
      if(lastId > 0){
        return query.where('id', '<', lastId)
      }
      return query
    }

    deleteReply(key, value){
        return Comment.query().where(key, value).delete();
    }

    decCommentCount( parentId){
         return Comment.query().where('id', parentId).decrement('reply_count', 1)
    }

    editStaticPages(ctx){
      let data = ctx.request.all()
      return StaticPage.query().where('id', data.id).update({'description': data.description})
    }

    editOgimage(ctx){
      let data =ctx.request.all()
      return Ogimage.query().where('id', data.id).update({'ogimage': data.ogimage})
    }

    getOgimage(){
      return Ogimage.all();
    }

}
