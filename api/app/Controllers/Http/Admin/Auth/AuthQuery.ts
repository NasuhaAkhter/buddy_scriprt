import User from '../../../../Models/User'


export default class AuthQuery{
  
  getSingleUser(key:string, value:string){
      return User.query().where(key, value).first();
  }

}
