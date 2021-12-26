import { schema, rules} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EventValidator{
  
    public async validateEventSchema(ctx : HttpContextContract){
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

    public async validateAddEventSchema(ctx : HttpContextContract){
      // const data = ctx.request.all()
      const validationSchema = schema.create({
        event_name: schema.string(),
        address: schema.string(),
        start_time: schema.string(),
        end_time: schema.string(),
        about: schema.string({}, [
          rules.maxLength(1000)
        ])
      }) 
      const msg =  {
        'event_name.required': 'Event name is required',
        'address.required': 'Address is required',
        'start_time.required': 'Event start time is required',
        'end_time.required': 'Event end time is required',
      }
      //return await ctx.request.validate({ schema: userSchema, messages : msg })
      try {
        const payload = await ctx.request.validate({ schema: validationSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
    }
    
    
    public async validateDeleteSchema(ctx : HttpContextContract){
      // const data = ctx.request.all()
      const validationSchema = schema.create({
        event_id: schema.number(),
      }) 
      const msg =  {
        'event_id.required': 'Event is required',
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
