import User from '../../../Models/User'
import Event from '../../../Models/Event'
import Feed from '../../../Models/Feed'
import Friend from '../../../Models/Friend'
import Eventinvite from '../../../Models/Eventinvite'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
// import moment from 'moment'

export default class EventQuery{
    public date = DateTime.now().toUTC()	//=>	[ DateTime 2021-08-26T03:50:18.833Z ]
   //  public date = moment().format("YYYY-MM-DD");

    public async getUserByLimit(limit : number) : Promise<User[]> {
       const user = User.query().limit(limit)
       return user
    }

    public async createEvent(eventData){
        return await Event.create(eventData)
     }
     public async editEvent(eventData,pid){
       await Event.query().where('id',pid).update(eventData)
       return Event.query().where('id',pid).first()
     }
     
     async deleteEvent(eId){
        return Event.query().where('id', eId).delete()
     }

     searchSlug(event_name){
        return Database.from('events')
      //   .where('end_time' ,'>=', `${this.date}`)
        .where('slug','like', `${event_name}%`).count('* as total')
     }
     public async getAllEvent(limit,page,uid) {
        return await Event.query()
      //   .where('end_time' ,'>=', `${this.date}`)
        .where('user_id',uid).preload('going').orderBy('id','desc').paginate(page, limit)
      }
     public async getInterestedEvent(limit,page,user_id : number) {
        return await Event.query()
      //   .where('end_time' ,'>=', `${this.date}`)
        .preload('going')
         .where((builder) => {
            builder.whereIn('id', (builder) => {
               builder.select('event_id')
               .from('eventinvites')
               .where('status','interested')
               .where('user_id',user_id)
               })
            })
         .orderBy('id','desc').paginate(page, limit)
      }
     public async getGoingEvent(limit,page,user_id : number) {
        return await Event.query().preload('going')
            // .where('end_time' ,'>=', `${this.date}`)
            .where('user_id', '!=',user_id)
            .where((builder) => {
               builder.whereIn('id', (builder) => {
                  builder.select('event_id')
                  .from('eventinvites')
                  .where('status','going')
                  .where('user_id',user_id)
               })
            })
            .orderBy('id','desc').paginate(page, limit)
      }
     public async getDiscoverEvent(limit,page,user_id) {
        return await Event.query().preload('going')
      //   .where('end_time' ,'>=', `${this.date}`)
        .where((builder) => {
            builder.whereNotIn('id', (builder) => {
               builder.select('event_id')
               .from('eventinvites') 
               .whereIn('status',['going', 'interested'])
               .where('user_id',user_id)
            })
         })
         .orderBy('id','desc').paginate(page, limit)
      }

      public async getUserBasicOverView(slug : string) : Promise<any|null> {
         return await Event.query().where('slug',slug)
         .preload('going') 
        .preload('interested')
      //   .where('end_time' ,'>=', DateTime.local().toSQLDate())
        .first()
      //   .where((builder) => {
      //       builder.where('end_time' ,'>', DateTime.local().toSQLDate()),
      //       builder.orWhere('end_time' ,'=', DateTime.local().toSQLDate())
      //    })
     }
     public async getProfileFeed(uid : number, more, user_id){
        let q = Feed.query().where('event_id', uid).orderBy('id', 'desc')
            .where((builder) => {
               builder.whereDoesntHave('blockedUser', (qq) => {
                  qq.where('user_id', user_id)
               })
               builder.whereDoesntHave('userBlocked',(q)=>{
                  q.where('blocked_user_id', user_id )
                  })
               })
            .preload('user').preload('savedPosts', (b) => {
               b.where('user_id', uid)
           })  
            .preload('like', (b) => {
                b.where('user_id', uid)
            })
            .preload('page')
            .preload('group')
            .preload('event')
         if(more > 0){
               q.where('id', '<', more)
           }
          return q.limit(15)
      }
  
      async getUserUploadedFile(fileType, uid){
        return Feed.query().where('event_id', uid).where('feed_privacy', '!=', 'ONLY ME').where('file_type', fileType).select('id','files')
     }
     async saveUserInfo(userColumnsObj : object, uid){
        return Event.query().where('id', uid).update(userColumnsObj)
     }

     public async getAllMembers(uid : number,lastId,event_id : number){
      let q = Friend.query().where('user_id', uid)
                                   .where('status','accepted')
                                   .preload('friend')
                                   .where((builder) => {
                                    builder.whereNotIn('friend_id', (builder1) => {
                                        builder1.select('user_id')
                                        .from('eventinvites')
                                        .where('event_id',event_id)
                                      })
                                    })
      if(lastId > 0){
         q.where('id', '>', lastId)
      }
      return q.limit(10)                         
    }
     public async addMember(data){
        return await Eventinvite.firstOrCreate(data)
    }
     public async eventinvitesMember(event_invite_id){
        return await Eventinvite.query().where('id',event_invite_id).preload('friend').first()
    }
     public async getAllInvitedMembers(event_id : number,lastId){
      let q = Eventinvite.query().where('event_id',event_id).preload('friend')
      if(lastId > 0){
         q.where('id', '>', lastId)
       }
       return q.limit(10)
    }
     public async isInvited(event_id : number,user_id : number){
      return Database.query().from('eventinvites').where('event_id',event_id).where('user_id',user_id).first()
    }
     public async goingInterested(event_id : number,user_id : number,status){
        return await Eventinvite.query().where('event_id',event_id)
                                 .where('user_id',user_id).update({
                                    status:status
                                 })
    }
     public async deleteInvite(event_id : number,user_id : number){
        return await Eventinvite.query().where('event_id',event_id)
                                 .where('user_id',user_id).delete()
    }

     public async createGoingInterested(event_id : number,user_id : number,status){
        return await Eventinvite.create({
                                    event_id:event_id,
                                    user_id:user_id,
                                    status:status,
                                 })
    }
    public async getIsGoing(event_id : number,user_id:number){ 
      return await Eventinvite.query().where('event_id',event_id)
      .preload('from_user')
      .where('user_id',user_id).first()
   }

   public async getEventEditDetails(event_id) {
      return await Event.query().where('id',event_id).preload('user').first()
   }

   public async searchInviteMember(user_id:number,str:string , event_id:number) {
      let searchTxt = `${str}*`
      return await Friend.query().where('user_id', user_id)
      .where('status','accepted')
      .preload('friend')
      .where((builder) => {
         builder.whereNotIn('friend_id', (builder) => {
            builder.select('user_id')
            .from('eventinvites')
            .where('event_id', event_id)
         })
      }) 
      .whereHas('friend', (builder1) => {
         builder1.whereRaw("MATCH (first_name, last_name) AGAINST (? IN BOOLEAN MODE)",[searchTxt])
      })
   }
    
   public async accecptInvite(user_id : number,event_id:number){ 
      return await Eventinvite.query().where('event_id',event_id).where('user_id',user_id).update({
         status:'going'
      })
   }
   public async cancelInvite(user_id : number,event_id:number){ 
      return await Eventinvite.query()
                              .where('event_id',event_id)
                              .where('user_id',user_id)
                              .delete()
   }
}
