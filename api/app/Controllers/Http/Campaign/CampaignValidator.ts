import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class CampaignValidator{
    public async validateCampaignSchema(ctx : HttpContextContract){
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

    public async validateCreateCampaignSchema(ctx : HttpContextContract){
      const validationSchema = schema.create({
        name: schema.string(),
        budget: schema.number(),
        start_date_time: schema.string(),
        end_date_time: schema.string(),
        destination_url: schema.string({}, [
          rules.url()
        ]),
        text: schema.string(),
        short_description: schema.string(),
        page_id: schema.number(),
        feed_id: schema.number(),
      }) 
      const msg =  {
        'name.required': 'Campaign name is required',
        'budget.required': 'Budget is required',
        'start_date_time.required': 'Start date is required',
        'end_date_time.required': 'End date is required',
        'destination_url.required': 'Destination url is required',
        'destination_url.url': 'Please give a valid url',
        'page_id.required': 'Please select a page',
        'feed_id.required': 'Please select a feed',
        'text.required': 'Text is required',
        'short_description.required': 'Short description url is required',
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
