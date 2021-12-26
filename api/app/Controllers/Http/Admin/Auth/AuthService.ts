
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthQuery from './AuthQuery';
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthService {
    private authQuery : AuthQuery
    constructor(){
      this.authQuery = new AuthQuery
    }
    
    public async loginAdmin(ctx: HttpContextContract): Promise<any>{
        
      let data = ctx.request.all()
       
        let check:any =await this.authQuery.getSingleUser('email', data.email)
        if(!check || check.userType !=1){
          return ctx.response.status(401).send({ message: 'Invalid Admin credentials!' })
        }
        
        let checkPass =await Hash.verify(check.password, data.password)
        if (!checkPass) {
          return ctx.response.status(401).send({ message: 'Invalid Admin credentials!' })
        }
        
        return ctx.auth.use("web").attempt(data.email, data.password)
        
    }
};
