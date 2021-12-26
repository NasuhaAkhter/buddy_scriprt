import User from 'App/Models/User'
import Group from 'App/Models/Group'
import Page from 'App/Models/Page'
 

import Database from '@ioc:Adonis/Lucid/Database'
export default class AuthQuery{
  createUser(user){
      return User.create(user)
  }
  searchUsername(username){
      return Database.from('users').where('username','like', `${username}%`).count('* as total')
  }

  updateUser(column, value, data){
      return User.query().where(column, value).update(data)
  }
  fetchUSer(uid){
    return User.query().where('id', uid)  
  }
   
  singleUserToken(column, value, token) {
    return User.query().where(column, value).where('forgot_code', token).first()
  }
  getSingleUserInfo(column, value) {
    return User.query().where(column, value).first()
  }
  updateOnline(uid, isOnline){
     return User.query().where('id', uid).update({is_online : isOnline})
  }
  deleteAccount(uid){
    return User.query().where('id', uid).delete()
  }
  decrementGroupMember(group_id, string){
     return Group.query().where('id', group_id).increment('total_members', string)
  }
  decrementPageLike(page_id, string){
    return Page.query().where('id', page_id).increment('total_page_likes', string)
  }
  fetch_user_data(uid){
     return User.query().where('id', uid).preload('isGroupMember')
     .preload('isPageFollower', (b) => {
        b.preload('page')
      }).first()
    //  .preload('isinvitedInEvent', (b) => {
    //     b.preload('event')
    //   })  
  }

}
