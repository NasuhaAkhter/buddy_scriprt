import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CommentQuery from './CommentQuery';
import Event from '@ioc:Adonis/Core/Event'
export default class CommentService {
    private commentQuery : CommentQuery
    constructor(){
      this.commentQuery = new CommentQuery
    }
    async createComment(ctx : HttpContextContract){
      let data = ctx.request.all()
      let user = ctx.auth.user
      if(!user) return 
      data.user_id = user?.id
      let feed_user_id = data.feed_user_id ? data.feed_user_id : user?.id
      delete data.feed_user_id
      
      const comment :any = await  this.commentQuery.createComment(data)
      // const feed: any = await this.commentQuery.fetchFeed(data.feed_id)
      if(!data.parrent_id){
        console.log("Origin comment")
         // if it's orginal comment then increament the comment count by 1
        this.commentQuery.addOrRemoveCommentCount(data.feed_id, 1)

        if(data.user_id != feed_user_id){
          // let user = ctx.auth.user
          let noti_meta = {
            id : user?.id,
            profile_pic : user?.profile_pic,
            first_name : user?.first_name,
            last_name : user?.last_name,
            action_text: 'commented on your post',
            comment_text : data.comment_txt
          }
          Event.emit('new:notification',
             {
              user_id: feed_user_id,
              from_id: user.id,
              feed_id: data.feed_id,
              noti_type : 'feed_comment',
              noti_meta: noti_meta,
              comment_id: comment.id,
              other_count: 0
            }
          )
        }
       
        return comment
      }else{
        const parentComment :any = await  this.commentQuery.getCommentInfo(data.parrent_id, user.id)
         console.log("maybe reply", parentComment.userId, user.id )
         if(parentComment.userId != user.id){
          console.log("reply notification")

          // let user = ctx.auth.user
          let noti_meta = {
            id : user?.id,
            profile_pic : user?.profile_pic,
            first_name : user?.first_name,
            last_name : user?.last_name,
            action_text: 'commented on your comment',
            comment_text : data.comment_txt
          }
          Event.emit('new:notification',
             {
              user_id: parentComment.userId,
              from_id: user.id,
              feed_id: data.feed_id,
              noti_type : 'feed_comment',
              noti_meta: noti_meta,
              comment_id: comment.id,
              other_count: 0
            }
          )
        }
      }
      // its a reply.. so we need to insert reply_count by one to the comments row
      this.commentQuery.addOrRemoveReplyCount(data.parrent_id, 1)


      return comment
    }
    async getComment(ctx : HttpContextContract){
      let moreId = parseInt(ctx.request.all().more)
      
      let commentData  = await this.commentQuery.getComment(ctx.params.id,moreId,ctx.auth.user?.id)
      for(let d of commentData){
          d.replies = []
      }
       return commentData
    }
    async getReply(ctx : HttpContextContract){
      let moreId = parseInt(ctx.request.all().more)
      console.log(moreId)
      let commentData  = await this.commentQuery.getReply(ctx.params.parrentId,moreId,ctx.auth.user?.id)
      for(let d of commentData){
          d.replies = []
      }
       return commentData
    }
    async likeComment(ctx : HttpContextContract){
      let data = ctx.request.all()
      data.user_id = ctx.auth.user?.id
      let uid = ctx.auth.user?.id
      let comment:any  = await this.commentQuery.getCommentInfo(data.comment_id,uid)

      if(!comment) return ctx.response.status(404).send({msg: "This comment has been deleted or you don't have permission to take this action!"})
      // check if user has reacted before or not..
      if(comment.commentlike){ // user reacted on this post before...
        comment.like_count--
      }else{
        comment.like_count++
      }
      //  return comment
      await Promise.all([
        this.commentQuery.deleteOrCreateLike({comment_id : data.comment_id, user_id : uid},comment.commentlike),
        this.commentQuery.updateCommentLike({like_count : comment.like_count}, data.comment_id)
      ])

      // fire notification events
      if(!comment.commentlike && comment.userId != uid){
 
        let user = ctx.auth.user
        if(!user) return;
        let noti_meta = {
          id : user?.id,
          profile_pic : user?.profile_pic,
          first_name : user?.first_name,
          last_name : user?.last_name,
          action_text: 'loves your comment'
        }
        Event.emit('new:notification',
           {
            user_id: comment.userId,
            from_id: user?.id,
            feed_id: comment.feedId,
            noti_type :'comment_like',
            noti_meta: noti_meta,
            comment_id: comment.id,
            other_count: comment.like_count
          }
        )
        }else{
           Event.emit('delete:commentNotification',
          {
              user_id: comment.userId,
              from_id: uid?uid:0,
              feed_id: comment.feedId,
              comment_id: comment.id,
              noti_type :'comment_like',
              is_deleted:true
            }
          )
      }
      return comment.like_count
    }
    async editComment(ctx : HttpContextContract){
      let data = ctx.request.all()
      data.user_id = ctx.auth.user?.id
      return this.commentQuery.editComment(data)
    }

    /**
     * This method delete a comment or reply since they are in same table.
     * A logic must be added to reduce the comment_count or reply_count based on the comment/reply
     * @param  {HttpContextContract} ctx
     */
    async deleteComment(ctx : HttpContextContract){
      let data = ctx.request.all()
      data.user_id = ctx.auth.user?.id

      if(!data.parrent_id){ // reduce comment_count
        this.commentQuery.addOrRemoveCommentCount(data.feed_id, -1)
      }else{
        this.commentQuery.addOrRemoveReplyCount(data.parrent_id, -1)
      }

      return this.commentQuery.deleteComment(data)
    }

};
