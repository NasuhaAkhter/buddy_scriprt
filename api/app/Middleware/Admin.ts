import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle ({auth, response}: HttpContextContract, next: () => Promise<void>) {
    let check :any =await auth.use('web').authenticate()
    
    if(!check || (check && check.userType !=1) ){
      
      return response.status(401).send({ message: 'Invalid admin credentials!' })
      
    }
    await next()
  }
}
 