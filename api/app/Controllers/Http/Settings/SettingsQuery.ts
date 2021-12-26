import Ogimage from 'App/Models/Ogimage'
import User from '../../../Models/User'
export default class ExampleQuery{
    public async getUserByLimit(limit : number) : Promise<User[]> {
       const user = User.query().limit(limit)
       return user
    }
   async profileSettingUpdate(updateData : object, uid){
      return User.query().where('id', uid).update(updateData)
   }

   async changePassword(updateData : object, uid){
      return User.query().where('id', uid).update(updateData)
   }
   getSingleUser(key, value){
      return User.query().where(key, value).first();
   }

   getSingleOgimage(){
    return Ogimage.query().where('id',1).first();
   }

}
