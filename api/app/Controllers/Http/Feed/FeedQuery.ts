import Feed from 'App/Models/Feed'
import Report from 'App/Models/Report'
import Like from 'App/Models/Like'
import Campaign from 'App/Models/Campaign'
import AdRate from 'App/Models/AdRate'
import Savepost from 'App/Models/Savepost'
// import Notification from 'App/Models/Notification'
// import Database from '@ioc:Adonis/Lucid/Database';
export default class FeedQuery{
  async updateAddData(data){

       await Campaign.query().where('id', data.id).update(data)
       return Campaign.query().where('id', data.id).first()

  }
  async getSingleAdds(id){
    return Campaign.query().where('id', id).withCount('totalAdClick',(q)=>{
      q.where('activity_type', 'click')
    }).withCount('totalAdImpression', (q) => {
      q.where('activity_type', 'impression')
    }).first()
  }
  async getRate(){
    return AdRate.query().where('activity_type', 'click').orWhere('activity_type','impression')

  }

  async deleteFeed(id){
    return Feed.query().where('id',id).delete()
  }

  async createReport(data){
    return Report.create(data)
  }

  async createFeed(data){
    return Feed.create(data)
  }
  async feedIncrement(feedId, value){
    return Feed.query().where('id', feedId).increment('share_count', value)
  }
  async pendingAdsChecking(current_date, data){
    return Campaign.query().where('start_date_time', '<=', current_date).where('status', 'Pending').update(data)
  }
  async getAdds(current_date, user,last_id): Promise<Campaign[]>{
        let query =  Campaign.query()
      .where('start_date_time', '<=', current_date)
      .where('end_date_time', '>=', current_date)
      .where('status', 'Running')
      .where('user_id', '!=', user.id)
      .where(builder => {
        builder.where('gender', user.gender)
        builder.orWhereNull('gender')
        builder.orWhere('gender', 'all')

      })
      if(user.birth_date){
        query.where(builder => {
          builder.where('age_to', '<=', user.birth_date)
          builder.orWhereNull('age_to')
        })
        .where(builder => {
          builder.where('age_from', '>=', user.birth_date)
          builder.orWhereNull('age_from')
        })
      }
      if(user.country){
        query.where(builder => {
          builder.where('country', user.country)
          builder.orWhereNull('country')
          builder.orWhere('country', 'all')
        })
      }

      query.select('id', 'feed_id')
    if (last_id) query.where('id', '<', last_id)
      .orderBy('id', 'desc')
      .limit(5)
    return  query
  }
  async getFeed(uid, more, feed_type){

     let q = Feed.query()
            .preload('share', (sQuery) => {
              sQuery.where('feed_privacy', '!=', 'ONLY ME')
              sQuery.preload('user')

              sQuery.preload('group',(a)=>{
                a.select('id','group_name','slug','profile_pic')
              })
              sQuery.preload('page',(a)=>{
                a.select('id','page_name','slug','profile_pic')
              })
              sQuery.preload('event',(a)=>{
                a.select('id','event_name','slug')
              })
            })
            // .preload('user',qq=>{
            //     qq.select('id','first_name','last_name','username', 'profile_pic')
            // })
            .preload('user', (usersQuery) =>{
              usersQuery.select('id','first_name','last_name','username', 'profile_pic')
            })
            .where((builder) => {
              builder.whereDoesntHave('blockedUser', (qq) => {
                qq.where('user_id', uid)
              })
              builder.whereDoesntHave('userBlocked',(q)=>{
                q.where('blocked_user_id', uid )
               })
            })
            .preload('group')
            .where((builder) => {
              builder.where((query) => {
                query
                   .whereNull('group_id')
               })
              builder.orWhere((query) => {
                query
                  .whereNotNull('group_id')
                  .whereHas('group', (groupQuery) => {
                    groupQuery.where('group_privacy', 'PUBLIC')
                    groupQuery.orWhere((memberQuery) => {
                      memberQuery.whereHas('is_member', (memberQuery2) => {
                        memberQuery2.where('user_id', uid)
                      })
                    })
                  })
              })
            })
            .preload('event')
            .preload('page')
            .preload('like', (b) => {
                b.where('user_id', uid)
            })
            .preload('savedPosts', (b) => {
              b.where('user_id', uid)
            })
      if(feed_type == 'world'){
        q.where('feed_privacy', 'PUBLIC')
      }
      else if(feed_type == 'savePost'){
        q.whereHas('savedPosts', (b) => {
          b.where('user_id', uid)
        })
      }
      else{
          q.where((builder) => {
            builder.whereHas('friend', (qq) => {
              qq.where('friend_id', uid)
            })
            builder.whereIn('feed_privacy', ['PUBLIC', 'FRIENDS'])
            builder.where('activity_type', 'feed')
          })
          q.orWhere((builder1) => {
            builder1.where('activity_type', 'page')
            builder1.whereHas('is_page_followed', (qq) => {
             qq.where('user_id', uid)
             })
          })
          q.orWhere((builder1) => {
            builder1.where('activity_type', 'event')
            builder1.whereHas('is_event_invited', (qq) => {
             qq.where('user_id', uid)
             })
          })
          q.orWhere('user_id', uid)

      }

      if(more > 0){
          q.where('id', '<', more)
        }
     return q.orderBy('id', 'desc').limit(15)
  }
  async getSingleFeed(id,uid, privacy){
     let feed :any= Feed.query().where('id', id)
       .orderBy('id', 'desc')
      .preload('share', (sQuery) => {
        sQuery.where('feed_privacy', '!=', 'ONLY ME')
        sQuery.preload('user')
        sQuery.preload('group',(a)=>{
          a.select('id','group_name','slug','profile_pic')
        })
        sQuery.preload('page',(a)=>{
          a.select('id','page_name','slug','profile_pic','user_id')
        })
        sQuery.preload('event',(a)=>{
          a.select('id','event_name','slug', 'user_id', 'cover')
        })
      })
      .preload('user')
      //  .preload('blockedUser',(q)=>{
      //       q.where('user_id', uid )
      //  })
      //  .preload('userBlocked',(q)=>{
      //       q.where('blocked_user_id', uid )
      //  })
      .where((builder) => {
        builder.whereDoesntHave('blockedUser', (qq) => {
          qq.where('user_id', uid)
        })
        builder.whereDoesntHave('userBlocked',(q)=>{
          q.where('blocked_user_id', uid )
         })
      })
      // .preload('user', (usersQuery) =>{
      //   usersQuery.preload('block',(q)=>{
      //     q.where('user_id', uid )
      //  })
      // })
       .preload('page', (sQuery) => {
        sQuery.select('id','page_name','slug','profile_pic','user_id')
      })
      .preload('group', (sQuery) => {
        sQuery.select('id','group_name','slug','profile_pic')
      })
      .preload('event', (sQuery) => {
        sQuery.select('id','event_name','slug', 'user_id', 'cover')
      })
      .preload('savedPosts', (b) => {
        b.where('user_id', uid)
      })
      .preload('like', (b) => {
          b.where('user_id', uid)
      })


     if(!privacy){
      feed.where('feed_privacy', '!=', 'ONLY ME')
     }

    return feed
  }
  async getFeedInfo(feed_id, uid){
    return Feed.query().where('id', feed_id).select('id','like_count', 'user_id')
    .preload('like', (b)=>{
      b.where('user_id', uid)
    })
    .preload('savedPosts', (b) => {
      b.where('user_id', uid)
    })
    .first()
  }
  async feedUserLike(fId, fui){
    return Like.query().pojo<{ total: number }>().where('feed_id', fId).where('user_id', fui).count('id as total').first()
  }
  async saveFeedforUser(data){
    return  await Savepost.firstOrCreate({feed_id:data.feed_id}, {user_id:data.user_id})
  }
  async unsaveFeedforUser(data){
    return  await Savepost.query().where('feed_id', data.feed_id).where('user_id',data.user_id).delete()
  }
  async deleteOrCreateLike(likeData, isLike){

    if(!isLike){
        return Like.create(likeData)
     }
    //  await Notification.query().where('from_id', likeData.user_id).where('feed_id', likeData.feed_id).delete()
     return Like.query().where('user_id', likeData.user_id).where('feed_id', likeData.feed_id).delete()

  }
  async updateFeedLike(likesMeta, id){
     return Feed.query().where('id', id).update(likesMeta)
  }
  async updateFeed(data){
   return Feed.query().where('id', data.id).update(data)
  }
}
