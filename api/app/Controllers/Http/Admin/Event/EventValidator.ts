import { schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class EventValidator{

    public async validateRateSchema(ctx : HttpContextContract){

      const validationSchema = schema.create({
        ad_type: schema.string(),
        activity_type: schema.string(),
        amount: schema.number()
      }) 
      const msg =  {
        'ad_type.required': 'Add Type is required',
        'activity_type.required': 'Activity Type name is required',
        'amount.required': 'Amount is required',
      }
      //return await ctx.request.validate({ schema: userSchema, messages : msg })
      try {
        const payload = await ctx.request.validate({ schema: validationSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }

    }
    
    public async validateCreateRateSchema(ctx : HttpContextContract){

      const validationSchema = schema.create({
        ad_type: schema.string(),
        activity_type: schema.string(),
        amount: schema.number()
      }) 
      const msg =  {
        'ad_type.required': 'Add Type is required',
        'activity_type.required': 'Activity Type name is required',
        'amount.required': 'Amount is required',
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
