import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class UserValidator{
  
    public async validateEditUserSchema(ctx : HttpContextContract){
      let data = ctx.request.all();
      const userSchema = schema.create({
        first_name: schema.string({trim: true,}),
        last_name: schema.string({trim: true,}),
        username: schema.string({trim: true,}),
        gender: schema.string({trim: true,}),
        status: schema.string({trim: true,}),
        email: schema.string({trim: true}, [
          rules.email({
            sanitize: true,
          }),
          rules.unique({
            table: 'users',
            column: 'email',
            whereNot: {
              id: data.uId,
            },
          })
          
        ]),


      })
      const msg =  {
        'email.required': 'Email is required',

      }
      try {
        const payload = await ctx.request.validate({ schema: userSchema, messages : msg })
        return payload
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }



    }
}
