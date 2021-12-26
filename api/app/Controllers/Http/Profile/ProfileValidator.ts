import { schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class ProfileValidator{

  public async validateBlockUserSchema(ctx : HttpContextContract){
    const blockUserSchema = schema.create({
      blocked_user_id: schema.number(),

    })
    const msg =  {
      'blocked_user_id.required': 'Invalid data sent!',
    }
    return ctx.request.validate({ schema: blockUserSchema, messages : msg })
    
  }

  public async validateUnBlockUserSchema(ctx : HttpContextContract){
    const blockUserSchema = schema.create({
      bId: schema.number(),

    })
    const msg =  {
      'bId.required': 'Invalid data sent!',
    }
    return ctx.request.validate({ schema: blockUserSchema, messages : msg })
    
  }
  
  
}
