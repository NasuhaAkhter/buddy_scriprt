import CommentService from './CommentService';
import CommentValidator from './CommentValidator';
export default class CommentController {
  private commentService : CommentService
  private commentValidator : CommentValidator
  constructor () {
    this.commentService =  new CommentService()
    this.commentValidator =  new CommentValidator()
  }
  async createComment(ctx){
    // await this.commentValidator.createCommentValidate(ctx)
    return this.commentService.createComment(ctx)
  }
  async getComment(ctx){
      return this.commentService.getComment(ctx)
  }
  async getReply(ctx){
      return this.commentService.getReply(ctx)
  }

  async likeComment(ctx){
     await this.commentValidator.commentLikeValidator(ctx)
     return this.commentService.likeComment(ctx)

  }
  async editComment(ctx){
     await this.commentValidator.editComment(ctx)
     return this.commentService.editComment(ctx)
  }
  async deleteComment(ctx){
     await this.commentValidator.deleteCommentValidate(ctx)
     return this.commentService.deleteComment(ctx)
  }
}
