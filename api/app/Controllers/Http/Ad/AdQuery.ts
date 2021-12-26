import Add from '../../../Models/Add'
export default class AdQuery{
    public async getUserByLimit(limit: number): Promise<Add[]> {
        const user = Add.query().limit(limit)
       return user
    }
    public async getAddLists(uid, page,limit){
      
        return  Add.query().where('user_id', uid).paginate(page, limit)
    }
}
