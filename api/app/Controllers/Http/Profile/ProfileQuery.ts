import Feed from 'App/Models/Feed'
import Friend from 'App/Models/Friend'
import User from 'App/Models/User'
import Notification from 'App/Models/Notification';
import Database from '@ioc:Adonis/Lucid/Database'
import Block from 'App/Models/Block';


export default class ProfileQuery{
    public async getUserBasicOverView(username : string, userId) : Promise<User|null> {
       return User.query().where('username', username).preload('friend', (b) => {
                b.where('user_id', userId)
              })
              .where((builder) => {
               builder.whereDoesntHave('blockedUser', (qq) => {
                 qq.where('user_id', userId)
               })
               builder.whereDoesntHave('userBlocked',(q)=>{
                 q.where('blocked_user_id', userId )
                })
              })
              .first()
    }
    public async getProfileFeed(uid : number,more, privacy : string[],ok=false, auid){
      let q = Feed.query().whereIn('feed_privacy', privacy).where('activity_type', 'feed').where('user_id', uid).orderBy('id', 'desc')
            .preload('share', (sQuery) => {
               sQuery.preload('user')
               sQuery.preload('group',(a)=>{
               a.select('id','group_name','slug')
               })
               sQuery.preload('page',(a)=>{
               a.select('id','page_name','slug')
               })
               sQuery.preload('event',(a)=>{
               a.select('id','event_name','slug')
               })
               // sQuery.whereIn(['feed_privacy'], [
               //    ['Public']
               //  ])
               sQuery.orWhere('user_id',auid)
               sQuery.orWhere('feed_privacy','!=','ONLY ME')
            })
          .preload('user')
          .preload('group')
          .preload('page')
          .preload('event')
          .preload('savedPosts', (b) => {
            b.where('user_id', uid)
          })

          .preload('like', (b) => {
              b.where('user_id', auid)
          })
         if (ok) {
               q.whereNull('event_id')
               q.whereNull('group_id')
         }
         if(more > 0){
            q.where('id', '<', more)
         }
        return q.limit(15)
    }
    async saveUserInfo(userColumnsObj : object, uid){
       return User.query().where('id', uid).update(userColumnsObj)
    }
    async getSearchFriend(str : any,  uid){
        let q = Database.from('users').join('friends', (query) => {
         query
          .on('users.id', '=', 'friends.user_id')
          .andOn('friends.friend_id', uid)
       }).select('users.id','users.is_online', 'users.first_name' , 'users.last_name', 'users.profile_pic')
       .whereRaw(`users.first_name LIKE '%${str.str}%'`).orWhereRaw(`users.last_name LIKE '%${str.str}%'`)
      return q
    }
    async getUserId(username: string){
       return User.query().where('username', username).select('id').first()
    }
    async getFriendLists(userId, uid){
      return User.query().whereHas('isfriend', (b)=>{
            b.where('friend_id', userId)
          }).preload('friend', (b) => {
              b.where('friend_id', uid)
          })
    }
    async getFriendStatus(userId, uid){
       return Friend.query().where('user_id', userId).where('friend_id', uid).first()
    }
    async addFriendData(friends){
       return Friend.createMany(friends)
    }
    async deleteFriend(userId, uid){
       return Friend.query().where((q)=>{
            q.where('user_id', userId).where('friend_id', uid)
          }).orWhere((q)=>{
            q.where('user_id', uid).where('friend_id', userId)
        }).delete()
    }
    async decreaseFriendCount(userId){
      await Database
      .from('users')
      .where('id', userId).where('friend_count' , '>', 0).increment('friend_count', -1)
    }
    async updateFriendStatus(userId, uid){
       return Friend.query().where((q)=>{
            q.where('user_id', userId).where('friend_id', uid)
          }).orWhere((q)=>{
            q.where('user_id', uid).where('friend_id', userId)
        }).update({status: 'accepted'})
    }
    async getUserUploadedFile(fileType, uid){
       return Feed.query().where('user_id', uid).where('activity_type', 'feed').where('file_type', fileType).select('id','files')
    }
    async getNotification(limit, page, userId){
       return Notification.query().where('user_id', userId)
       .preload('from_user')
       .orderBy('updated_at', 'desc').paginate(page, limit)
    }
    async updateNoti(userId){
       return Notification.query().where('user_id', userId).where('counter', '>', 0).update({counter : 0})
    }
    async unSeenNoti(userId, id){
       return Notification.query().where('user_id', userId).where('id',id).update({seen : 0})
    }
    async seenNoti(userId, id){
      return Notification.query().where('user_id', userId).where('id',id).update({seen : 1})
   }
   async deleteNoti(userId, id){
      return Notification.query().where('user_id', userId).where('id',id).delete()
   }
   async markAsReadAll(userId){
      return Notification.query().where('user_id', userId).update({seen : 1})
   }
    async getFriendRequests(page, limit,userId){
       return Friend.query().where('user_id', userId).where('status', 'waiting')
       .preload('friend').paginate(page, limit)
    }
    async resetFriend(userId){
       return User.query().where('id', userId).update({'friend_count' : 0})
    }
    async deleteRequest(userId,uid){
      return Friend.query().where((q)=>{
            q.where('user_id', userId).where('friend_id', uid)
          }).orWhere((q)=>{
            q.where('user_id', uid).where('friend_id', userId)
      }).delete()
    }
    async getFriendListsForChat(limit,page,userId){
      return User.query().whereHas('isfriend', (b)=>{
          b.where('friend_id', userId)
          b.where('status', 'accepted')
      }).select('id', 'is_online', 'first_name', 'last_name', 'profile_pic', 'username','about').orderBy('is_online','desc').paginate(page, limit)
    }
    async peopleList(limit,page,userId){
      return User.query()
      .whereDoesntHave('isfriend', (b)=>{
          b.where('friend_id', userId)
      })
      // .whereDoesntHave('block', (b)=>{
      //    b.where('user_id', userId)
      // })
      .where((builder) => {
         builder.whereDoesntHave('blockedUser', (qq) => {
           qq.where('user_id', userId)
         })
         builder.whereDoesntHave('userBlocked',(q)=>{
           q.where('blocked_user_id', userId )
          })
      })
      .where('id', '!=', userId)
      .select('id', 'is_online', 'first_name', 'last_name', 'profile_pic', 'username','about').orderBy('is_online','desc').paginate(page, limit)
    }
    async blockedPeopleList(limit,page,userId){
      return User.query().whereHas('block',(b)=>{
         b.where('user_id', userId)
     }).select('id', 'username', 'first_name', 'last_name', 'profile_pic')
     .orderBy('id','desc')
     .paginate(page, limit)
    }
    async getPeopleListBySearch(str,userId){
      return User.query().where('id', '!=', userId).where(q=>{
         q.whereRaw(`users.first_name LIKE '%${str}%'`).orWhereRaw(`users.last_name LIKE '%${str}%'`)
      })
      .select('id', 'is_online', 'first_name', 'last_name', 'profile_pic', 'username').orderBy('is_online','desc').limit(20)
    }

    async blockUser(data){
       return Block.create(data)
    }

    async unBlockUser(uId, bId){
       return Block.query().where('user_id',uId).where('blocked_user_id',bId).delete()
    }

    async darkModeChange(id, value){
       return User.query().where('id', id).update({'dark_mode':value})
    }
    async unblockUser(bId){
       return Block.query().where('blocked_user_id', bId).delete();
    }

    async signgleBlock(column, value){
       return Block.query().where(column, value).first();
    }

    async checkBlock(value,  value2){
      //  return Block.query().where(column, value).where(column2, value2).first()
       return User.query().where('id', value)
      .where((builder) => {
       builder.whereDoesntHave('blockedUser', (qq) => {
         qq.where('user_id', value2)
       })
       builder.whereDoesntHave('userBlocked',(q)=>{
         q.where('blocked_user_id', value2 )
        })
      })
      .first()
    }

}
