import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ChattingQuery from './ChattingQuery';
import CustomHelpers from 'App/Helpers/CustomHelpers';
import { v4 as uuidv4 } from 'uuid';
import Event from '@ioc:Adonis/Core/Event'
import * as _ from "lodash";
export default class ChattingService {
    private chattingQuery : ChattingQuery
    private customHelpers : CustomHelpers
    constructor(){
      this.chattingQuery = new ChattingQuery
      this.customHelpers = new CustomHelpers
    }
    public async insertChat(ctx : HttpContextContract){
      let data = ctx.request.all()
      if(!data.msg || isNaN(data.buddy_id)){ // validate request // need some extra works...
        return this.customHelpers.forbidden(ctx.response)
      }
      let user = ctx.auth.user
      if(!user) return
      let checkBlock = await this.chattingQuery.checkBlock( data.buddy_id, user.id)
      if(!checkBlock) return ctx.response.status(401).send({msg: 'User is not available for chat.'})
      // check if the logged in user has previous chat records
      let oldChatRecord = await this.chattingQuery.getOldChatRecord(user.id, data.buddy_id)
      let files = data.files
      let inbox_key = uuidv4()
      let chatObj = {user_id : user.id,inbox_key : inbox_key, msg : data.msg,files: files}
      if(!oldChatRecord){ // a brand new conversations...
        // create two inboxes....
         let inboxArray = [
                        {user_id : user.id, buddy_id : data.buddy_id, inbox_key : inbox_key, is_seen: 1},
                        {user_id : data.buddy_id, buddy_id : user.id, inbox_key : inbox_key, is_seen: 0},
                      ]

          let [chat] = await Promise.all([
            this.chattingQuery.createChat(chatObj),
            this.chattingQuery.createInbox(inboxArray),
          ])

          // emit event for notification...
          // chat.files = JSON.parse(chat.files)
          chat.files = chat.files? JSON.parse(chat.files) : []


          this.emitChat(data.buddy_id, chat, user)
          return chat
      }
      // use old inbox_key
      chatObj.inbox_key = oldChatRecord.inbox_key

      let chat = await this.chattingQuery.createChat(chatObj)
      chat.files = chat.files? JSON.parse(chat.files) : []
      this.emitChat(data.buddy_id, chat, user)
      // let other users seen as unseen
       await Promise.all([
        this.chattingQuery.updateSeen(data.buddy_id,  user.id, 0),
        this.chattingQuery.updateSeen(user.id, data.buddy_id, 1),
       ])

      return chat
   }

   async getChatLists(ctx : HttpContextContract){
      let data = ctx.request.all()
      if(isNaN(data.buddy_id)){ // validate request // need some extra works...
        return this.customHelpers.forbidden(ctx.response)
      }
      let userId = ctx.auth.user?.id
      if(!userId) return
      let chats : any = []
      // seelcting opiste member to know if that member has seen the last message I sent
      let key = await this.chattingQuery.getInboxKey(userId, data.buddy_id)
      if(!key)
       return {
        chatLists : [],
        seen: 0
     }
      chats  = await this.chattingQuery.getChatLists(key.inbox_key,userId,data.more)
      if(chats.length){
        chats[0].is_seen = key.is_seen
        // update seenk
        this.chattingQuery.updateSeenWithoutTime(userId, data.buddy_id, 1)
      }
      let formatedChat = this.customHelpers.formateChat(chats)
      // if()
      if(data.isApp!=1 && !data.more){
        formatedChat =   _.sortBy(formatedChat, 'id')
      }
      return {
         chatLists : formatedChat,
         seen: key.is_seen
      }

   }
   async getInbox(ctx : HttpContextContract){
      let userId = ctx.auth.user?.id
      if(!userId) return
      let inboxes = await this.chattingQuery.getInboxes(userId)

      return inboxes
   }
   async updateSeen(ctx : HttpContextContract){
      let userId = ctx.auth.user?.id

      if(!userId) return
      console.log('user id is',  ctx.request.all().uid)
      return this.chattingQuery.updateSeenWithoutTime(userId, ctx.request.all().uid, 1)
   }

  async emitChat(buddy_id, chatObj,user){
    Event.emit('new:chat', {
          noti_type : 'new_chat',
          buddy_id : buddy_id,
          from_id: user?.id,
          chatObj : chatObj,
          user: user
    })
  }

  async deleteSingleMsg(ctx : HttpContextContract){
    let userId = ctx.auth.user?.id
    if(!userId) return
    let data=ctx.request.all()
    let key = await this.chattingQuery.getInboxKey(userId,data.buddy_id)
    if(!key){
      return;
    }
    let isAuthorized = await this.chattingQuery.isAuthorizedUser(userId,key.inbox_key)
    if(!isAuthorized){
      return;
    }
    
    if( data.user_id == userId){
       return this.chattingQuery.singleMsgPermanentlyDelete(data.chat_id)
    }else{
       let res =await this.chattingQuery.isMsgFirstDeleteTrue(data.chat_id)
      if(res){
        return this.chattingQuery.isSingleMsgFirstDelete(data.chat_id,userId)
      } else{
        return this.chattingQuery.singleMsgPermanentlyDelete(data.chat_id)
      }
    }
  }

  async deleteFullConvers(ctx : HttpContextContract){
    let userId = ctx.auth.user?.id
    if(!userId) return
    let data=ctx.request.all()

    let key = await this.chattingQuery.getInboxKey(userId,data.buddy_id)
    if(!key){
      return;
    }
    let isAuthorized = await this.chattingQuery.isAuthorizedUser(userId,key.inbox_key)
    if(!isAuthorized){
      return;
    }
    let res =await this.chattingQuery.isConversFirstDeleteTrue(key.inbox_key)
    if(res){
      await this.chattingQuery.isFirstDeleteFullConvers(key.inbox_key,userId)
      return this.chattingQuery.isDeletedByBoth(key.inbox_key,data.buddy_id)
    } else{
      return this.chattingQuery.deleteFullConversPermanently(key.inbox_key,userId)
    }
  }
};
