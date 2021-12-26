import Database from '@ioc:Adonis/Lucid/Database'
import Comment from 'App/Models/Comment'
import Feed from 'App/Models/Feed'

import Commentlike from 'App/Models/Commentlike';
export default class CommentQuery{
  async createComment(data){
    return Comment.create(data)
  }
  async fetchFeed(feed_id){
    return Feed.query().where('id', feed_id).first()

  }
  async addOrRemoveCommentCount(feed_id : number, value: number){
    let q = Database 
          .from('feeds')
          .where('id', feed_id)
          if(value > 0){
            q.increment('comment_count', value)
          }else{
            q.increment('comment_count', value)
          }
    return q

  }
  async addOrRemoveReplyCount(parrent_id : number, value: number){
    let q = Database
          .from('comments')
          .where('id', parrent_id)
          if(value > 0){
            q.increment('reply_count', value)
          }else{
            q.increment('reply_count', value)
          }
    return q

  }

  async getReply(parrentId,moreId,uid){
    let query =  Comment.query().where('parrent_id', parrentId).orderBy('id', 'desc').limit(10)
      .preload('user').preload('commentlike', (b) => {
        b.where('user_id', uid)
      })
      if(moreId > 0){
        return query.where('id', '<', moreId)
      }
      return query

  }
  async getComment(feed_id,moreId,uid){
    let query =  Comment.query().where('feed_id', feed_id).whereNull('parrent_id').orderBy('id', 'desc').limit(10)
      .preload('user').preload('commentlike', (b) => {
        b.where('user_id', uid)
      })
      if(moreId > 0){
        return query.where('id', '<', moreId)
      }
      return query

  }
  async getCommentInfo(comment_id, uid){
    return Comment.query().where('id', comment_id).select('id','like_count', 'feed_id', 'user_id').preload('commentlike', (b)=>{
      b.where('user_id', uid)
    }).first()
  }
  async deleteOrCreateLike(likeData, isLike){
    console.log('like is', isLike)
    if(!isLike){
        return Commentlike.create(likeData)
     }
     return Commentlike.query().where('user_id', likeData.user_id).where('comment_id', likeData.comment_id).delete()

  }
  async updateCommentLike(likesMeta, id){
     console.log(likesMeta)
     return Comment.query().where('id', id).update(likesMeta)
  }
  async editComment(commentData){
     return Comment.query().where('id', commentData.id).where('user_id', commentData.user_id).update(commentData)
  }
  async deleteComment(commentData){

     return Comment.query().where('id', commentData.id).where('user_id', commentData.user_id).delete()
  }
}
