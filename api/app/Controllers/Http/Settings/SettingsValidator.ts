import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class SettingsValidator{
    public async validateSettingsSchema(ctx : HttpContextContract){
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
   

    public async profileSettingUpdateEmail(ctx : HttpContextContract){
      const userSchema = schema.create({
        email: schema.string({}, [
          rules.email({
            ignoreMaxLength: false,
            //domainSpecificValidation: true,
          }),
          rules.unique({ table: 'users', column: 'email' }),
        ])
      })
      const msg =  {
        'email.required': 'Email is required',
        'email.unique': 'Email is already in use',
        'email.email': 'Invalid email address'
      }
      return await ctx.request.validate({ schema: userSchema, messages : msg })
    }
    public async websiteValidator(ctx : HttpContextContract){
      const userSchema = schema.create({
        website: schema.string({}, [
          rules.url({
            protocols: ['http', 'https'],
             requireProtocol: true,
          })
        ])
      })
      const msg =  {
        'website.url': 'Invalid url'
      }
      return await ctx.request.validate({ schema: userSchema, messages : msg })
    }
    public async changePassword(ctx : HttpContextContract){
      const userSchema = schema.create({
        password: schema.string({escape: true,
          trim: true}, [
            rules.minLength(6),
            rules.confirmed()
        ]),
      })
      const msg =  {
        'password.required': 'Password is required',
        'password.minLength': 'Password must be at least 6 charecters long',
        'password_confirmation.confirmed': "Password and confirm password doesn't match",
      }
      return await ctx.request.validate({ schema: userSchema, messages : msg })
    }

  
    public async pSettingUpdateNameValidator(ctx : HttpContextContract){
      const validationSchema = schema.create({
        first_name: schema.string(),
        last_name: schema.string()
      }) 
      const msg =  {
        'first_name.required': 'First name is required',
        'last_name.required': 'Last name is required'
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
