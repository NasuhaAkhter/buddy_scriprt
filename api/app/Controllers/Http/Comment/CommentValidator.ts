import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class CommentValidator{
    async createCommentValidate(ctx : HttpContextContract){
      const createCommentSchema = schema.create({
        comment_txt: schema.string({}, [
           rules.maxLength(1000)
        ]),
        files: schema.string.optional()

      })
      const msg =  {
        'comment_txt.required': 'Write some comment text',
        'comment_txt.maxLength': 'You can add maximum of 1000 characters',

      }
      try {
        const payload = await ctx.request.validate({ schema: createCommentSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
    }
    async commentLikeValidator(ctx : HttpContextContract){
      const createCommentLikeSchema = schema.create({
          comment_id: schema.number()
      })
      const msg =  {
        'comment_id.required': 'Invalid data sent',
      }
      try {
        const payload = await ctx.request.validate({ schema: createCommentLikeSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
    }
    async editComment(ctx : HttpContextContract){
      const createCommentLikeSchema = schema.create({
          id: schema.number(),
          comment_txt: schema.string(),
      })
      const msg =  {
        'id.required': 'Invalid data sent',
        'comment_txt.required': 'Add a comment first.',
      }
      try {
        const payload = await ctx.request.validate({ schema: createCommentLikeSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
    }
    async deleteCommentValidate(ctx : HttpContextContract){
      const createCommentLikeSchema = schema.create({
          id: schema.number(),
          feed_id: schema.number(),
      })
      const msg =  {
        'id.required': 'Invalid data sent',
        'feed_id.required': 'Invalid data sent',

      }
      try {
        const payload = await ctx.request.validate({ schema: createCommentLikeSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
    }
}
