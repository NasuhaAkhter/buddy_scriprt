import Inbox from 'App/Models/Inbox';
import Chat from 'App/Models/Chat';
import User from 'App/Models/User';
// import { DateTime } from 'luxon'

export default class ChattingQuery{
    public async getOldChatRecord(userId,buddy_id) {
       return Inbox.query().where('user_id', userId).where('buddy_id', buddy_id).first()
    }
    public async createInbox(inboxArray : any[]){
       return Inbox.createMany(inboxArray)
    }
    public async createChat(chatObj){
       return Chat.create(chatObj)
    }
    public async getInboxKey(userId, buddy_id){
      return Inbox.query().where('user_id', buddy_id).where('buddy_id', userId).select('inbox_key', 'is_seen').first()
    }
    public async getChatLists(inbox_key, userId, more){
      let q = Chat.query().where('inbox_key', inbox_key).where('is_deleted', '!=', userId).orderBy('created_at', 'desc')
      if(more > 0){
        q.where('id', '<', more)
      }
      return q.limit(10)
    }
    public async getInboxes(userId){
      return Inbox.query().where('user_id', userId).orderBy('updated_at', 'desc')
                                                          .preload('lastmsg',(b) => {
                                                              b.where('is_deleted','!=',userId)
                                                          })
                                                          .preload('buddy')
    }
    public async updateSeen(user_id, buddy_id, is_seen){
      let currentdate = new Date();
      let datetime =
                currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-"
                +currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
      return Inbox.query().where('user_id', user_id).where('buddy_id', buddy_id).update({is_seen: is_seen, updated_at: datetime})
    }
    public async updateSeenWithoutTime(user_id, buddy_id, is_seen){
      return Inbox.query().where('user_id', user_id).where('buddy_id', buddy_id).update({is_seen: is_seen})
    }
    
    async checkBlock(value, value2){
      // return Block.query().where(column, value).where(column2, value2).first()
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

    
    async isAuthorizedUser(userId,inbox_key){
      return Inbox.query().where('inbox_key',inbox_key)
                          .where('user_id',userId)
                          .first()
    }
    async isMsgFirstDeleteTrue(chat_id){
      return Chat.query().where('id',chat_id).where('is_deleted',0).first()
    }
    async isSingleMsgFirstDelete(chat_id,user_id){
      return Chat.query().where('id',chat_id).where('is_deleted',0).update({
        is_deleted:user_id
      })
    }
    async singleMsgPermanentlyDelete(chat_id){
      return Chat.query().where('id',chat_id).delete()
    }

    async isConversFirstDeleteTrue(inboxKey){
      return Chat.query().where('inbox_key',inboxKey).where('is_deleted',0).first()
    }
    async isFirstDeleteFullConvers(inboxKey,userId){
      return Chat.query().where('inbox_key',inboxKey).where('is_deleted',0).update({
        is_deleted:userId
      })
    }
    async isDeletedByBoth(inboxKey,buddy_id){
      return Chat.query().where('inbox_key',inboxKey).where('is_deleted',buddy_id).delete()
    }
    async deleteFullConversPermanently(inboxKey,userId){
      if(userId) {
        
      }
      return Chat.query().where('inbox_key',inboxKey).where('is_deleted','>',0).delete()
    }
    

}
