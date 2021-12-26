import { schema, rules} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class PageValidator{
    public async validatePageSchema(ctx : HttpContextContract){
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

    public async validateAddPageSchema(ctx : HttpContextContract){
      const validationSchema = schema.create({
        page_name: schema.string(),
        // category_name: schema.string(),
        about: schema.string({}, [
          rules.maxLength(1000)
        ])
      }) 
      const msg =  {
        'page_name.required': 'Page name is required',
        // 'category_name.required': 'Category name is required',
        'about.required': 'Description is required',
      }
      //return await ctx.request.validate({ schema: userSchema, messages : msg })
      try {
        const payload = await ctx.request.validate({ schema: validationSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
    }
}
