
import Group from '../../../../Models/Group'
 
export default class GroupQuery{

    public async getMyGroupByLimit(data){
        let str  =data.str;
        let q = Group.query().orderBy(data.colName, data.order)
        .select('id','group_name', 'category_name', 'group_privacy', 'total_members','created_at')
        .withCount('feed')
        if(str){
            q.where((query) => {
              query.whereRaw("group_name  LIKE '%" + str + "%'")
              query.orWhereRaw("category_name  LIKE '%" + str + "%'")
              query.orWhereRaw("group_privacy  LIKE '%" + str + "%'")
              query.orWhereRaw("created_at  LIKE '%" + str + "%'")
            })
        }
        let grout = q.paginate(data.page, data.pageSize);
        return grout;
    }
    
    groupCount(){
      return Group.query().pojo<{ total: number }>().count('id as total').first()
    }
    
    getSingleGroup(key, value){
        return Group.query().where(key, value).first();
    }
  
    deleteGroup(key, value){
        return Group.query().where(key, value).delete();
    }
    

}
