import { schema, rules} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class FeedValidator{
    public async validateFeedSchema(ctx : HttpContextContract){
      const limitUserSchema = schema.create({
        limit: schema.number(),

      })
      const msg =  {
        'limit.required': 'Limit is required',
        'limit.number': 'Limit must be a number'
      }
      try {
        const payload = await ctx.request.validate({ schema: limitUserSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }

    }
    public async validateFeedDataSchema(ctx : HttpContextContract){
      const limitUserSchema = schema.create({
        feed_name: schema.string(),
        feed_privacy: schema.string(),
        category_name: schema.string(),
        about: schema.string(),

      })
      const msg =  {
        'feed_name.required': 'feed_name is required',
        'feed_name.string': 'feed_name must be a string',
        'feed_privacy.required': 'feed_privacy is required',
        'feed_privacy.string': 'feed_privacy must be a string',
        'category_name.required': 'category_name is required',
        'category_name.string': 'category_name must be a string',
        'about.required': 'about is required',
        'about.text': 'about must be in text type',
      }
      try {
        const payload = await ctx.request.validate({ schema: limitUserSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
    }
    public async validateAddMemberData(ctx: HttpContextContract){
      const validateAddMemberData = schema.create({
        feed_id: schema.number(),
        user_id: schema.number(),
        })
        const msg =  {
          'feed_id.required': 'Invalid data sent',
          'user_id.required': 'Invalid data sent',
        }
        try {
          const payload = await ctx.request.validate({ schema: validateAddMemberData, messages : msg })
          return payload
        } catch (error) {
          return ctx.response.status(422).send(error.messages)
        }
    }


    public async validateEditPageSchema(ctx : HttpContextContract){

      const validationSchema = schema.create({
        id: schema.number([
          rules.exists({ table: 'static_pages', column: 'id' })
        ]),
        description: schema.string(),
      })
      const msg =  {
        'id.required': 'Invalid Info.',
        'id.exists': 'Invalid Info',
        'description.required': 'Description is required',
      }
      return await ctx.request.validate({ schema: validationSchema, messages : msg })

    }
}
