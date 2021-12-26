import { schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class AdValidator{
    public async validateAdSchema(ctx : HttpContextContract){
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
    public async validateAdDataSchema(ctx : HttpContextContract){
      const limitUserSchema = schema.create({
        ad_name: schema.string(),
        ad_privacy: schema.string(),
        category_name: schema.string(),
        about: schema.string(),

      })
      const msg =  {
        'ad_name.required': 'ad_name is required',
        'ad_name.string': 'ad_name must be a string',
        'ad_privacy.required': 'ad_privacy is required',
        'ad_privacy.string': 'ad_privacy must be a string',
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
        ad_id: schema.number(),
        user_id: schema.number(),
        })
        const msg =  {
          'ad_id.required': 'Invalid data sent',
          'user_id.required': 'Invalid data sent',
        }
        try {
          const payload = await ctx.request.validate({ schema: validateAddMemberData, messages : msg })
          return payload
        } catch (error) {
          return ctx.response.status(422).send(error.messages)
        }
    }
}
