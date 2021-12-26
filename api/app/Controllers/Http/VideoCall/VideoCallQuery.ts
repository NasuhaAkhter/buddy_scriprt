import User from 'App/Models/User'
export default class CampaignQuery{
   public async getCallerInformation(user_id : number)  {
      return User.query().select('first_name','last_name','username','profile_pic','id').where('id',user_id).first()
       
   }
  
}
