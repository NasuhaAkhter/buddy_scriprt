import Transection from 'App/Models/Transection';
import User from '../../../../Models/User'


export default class UserQuery{

  getUserByLimit(data :any){
      let str  =data.str;

      let q = User.query().select('id','first_name', 'username', 'last_name', 'email', 'gender', 'status','created_at')
      .orderBy(data.colName, data.order)
      .withCount('feed', (q3)=>{
        q3.whereNull('page_id').whereNull('group_id').whereNull('event_id')
      })
      .withCount('feed', (q3)=>{
        q3.whereNotNull('group_id').as('groupfeedcount')
      })
      .withCount('feed', (q3)=>{
        q3.whereNotNull('page_id').as('pagefeedcount')
      })
      .withCount('feed', (q3)=>{
        q3.whereNotNull('event_id').as('eventfeedcount')
      }).withAggregate('trans', (query) => {
        query.sum('amount').as('user_balance')
      })
      if(str){
          q.where((query) => {
            query.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
            query.orWhereRaw("email  LIKE '%" + str + "%'")
            query.orWhereRaw("gender  LIKE '%" + str + "%'")
            query.orWhereRaw("status  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          }).where('userType', 0)
      }
      if(str && data.admin == 'admin'){
          q.where((query) => {
            query.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
            query.orWhereRaw("email  LIKE '%" + str + "%'")
            query.orWhereRaw("gender  LIKE '%" + str + "%'")
            query.orWhereRaw("status  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          }).where('userType', 1)
      }

      if(data.admin == "admin"){
        q.where('userType', 1).where('admin_status', '!=', 'super admin')
      }else{
        q.where('userType', 0)
      }
      let user = q.paginate(data.page, data.pageSize);

      return user;

  }

  userCount(){
    return User.query().pojo<{ total: number }>().where('userType',0).count('id as total').first()
  }

  getBlockedUser(data :any){
      let str  =data.str;
      let q = User.query().where('userType',0)
      .select('id','first_name', 'username', 'last_name', 'email', 'gender', 'status','created_at')
      .orderBy(data.colName, data.order).has('block')
      if(str){
          q.where((query) => {
            query.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
            query.orWhereRaw("email  LIKE '%" + str + "%'")
            query.orWhereRaw("gender  LIKE '%" + str + "%'")
            query.orWhereRaw("status  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          })
      }
      let user = q.paginate(data.page, data.pageSize);

      return user;

  }

  blockedUserCount(){
    return User.query().pojo<{ total: number }>().where('userType',0).count('id as total').first()
  }

  getSingleUser(key, value){
    return User.query().where(key, value).first();
  }
  checkUser(id, value){
    return User.query().whereNot('id', id).where('email', value).first()
  }

  deleteUser(key, value){
      return User.query().where(key, value).delete();
  }

  removefromAdmin(ctx){
      let data =  ctx.request.all();
      let id = data.uId;
      delete data.uId;
      return User.query().where('id', id).update(data);
  }

  editUser(data){
      let uid = data.uId;
      if(data.admin_status == "admin"){
        data.userType = 1
      }
      delete data.uId
      return User.query().where('id', uid).update(data);
  }

  editAdminUser(key, value, user){
      return User.query().where(key, value).update(user);
  }


  //user-trans
  getUserTrans(data :any){
       let str =data.str;
      let q = User.query().has('bill').select('id','first_name','last_name')
      .withAggregate('bill', (query) => {
        query.sum('amount').as('topup').where('reason','Top up')
      })
      .withAggregate('bill', (query) => {
        query.sum('amount').as('refund').where('reason','Refund')
      })
      .withAggregate('bill', (query) => {
        query.sum('amount').as('expense').where('reason','Create ad').orWhere('reason','Restart ad')
      })
      if(str){
        q.where((query) => {
          query.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
        })
     }

      let user = q.orderBy(data.colName, data.order).paginate(data.page, data.pageSize);

      return user;

  }


  transCount(){
    return User.query().has('bill').pojo<{ total: number }>().count('id as total').first()
  }

  updateWallet(ctx){
    let data = ctx.request.all();
    let id = data.id;
    delete data.id;
    return Transection.query().where('id', id).update(data)
  }


}
