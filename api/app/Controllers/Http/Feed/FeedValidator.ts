import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class FeedValidator{
  
    async createReportValidate(ctx : HttpContextContract){
      const createReportSchema = schema.create({
        text: schema.string({escape: true}, [
          rules.maxLength(500)
        ]),
        feed_id: schema.number(),

      })
      const msg =  {
        'text.required': 'Text is required!',
        'text.maxLength': 'You can add maximum of 500 characters',
        'feed_id.required': 'Feed is requird',
      }
      return await ctx.request.validate({ schema: createReportSchema, messages : msg })

    }
  
    async createFeedValidate(ctx : HttpContextContract){
      const createFeedSchema = schema.create({
        feed_txt: schema.string.optional({escape: true}, [
          // rules.requiredIfNotExists('files'),
          rules.requiredIfNotExistsAll(['files', 'share_id']),
          rules.maxLength(1500)
        ]),
        files: schema.string.optional(),
        // images:  schema.file.optional({
        //   size: '30mb',
        //   extnames: ['jpg', 'gif', 'png', 'PNG', 'JPG', 'JPEG', 'GIF'],
        // }),

      })
      const msg =  {
        'feed_txt.requiredIfNotExistsAll': 'Write some feed text',
        'feed_txt.maxLength': 'You can add maximum of 1500 characters',
        'files.required': 'Upload some pictures/video',
        // 'images.size': 'You can upload maximum of 5mb',
        // 'images.extnames': 'Please upload image file',
      }
      return await ctx.request.validate({ schema: createFeedSchema, messages : msg })

    }
    
    async deleteFeedValidate(ctx : HttpContextContract){
      const createFeedLikeSchema = schema.create({
          id: schema.number(),
          user_id: schema.number()
      })
      const msg =  {
        'id.required': 'Invalid data sent',
        'user_id.required': 'Invalid data sent'
      }
      try {
        const payload = await ctx.request.validate({ schema: createFeedLikeSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
    }
    async feedLikeValidator(ctx : HttpContextContract){
      const createFeedLikeSchema = schema.create({
          feed_id: schema.number(),

      })
      const msg =  {
        'feed_id.required': 'Invalid data sent',
      }
      try {
        const payload = await ctx.request.validate({ schema: createFeedLikeSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
    }
    async feedSaveValidator(ctx : HttpContextContract){
      const createFeedLikeSchema = schema.create({
          feed_id: schema.number(),

      })
      const msg =  {
        'feed_id.required': 'Invalid data sent',
      }
      try {
        const payload = await ctx.request.validate({ schema: createFeedLikeSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
    }
}
