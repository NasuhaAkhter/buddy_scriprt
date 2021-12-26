import User from 'App/Models/User'
import Transection from 'App/Models/Transection'
import Database from '@ioc:Adonis/Lucid/Database'

export default class BillQuery{
    public async getUserByLimit(limit : number) : Promise<User[]> {
       const user = User.query().limit(limit)
       return user
    }
    public async makePayment(data: object): Promise<Transection> {
        return Transection.create(data)
    }
    public async getCurrentBalance(userId:number){
        // return Transection.query().where('user_id', userId).
        return await Database
        .from('transections') 
        .select(Database.raw('sum(amount) as currentBalance'))
        .where('user_id', userId).first()
    }
    public async getTransactionList(userId:number, page:number, limit:number){
        return Transection.query().where('user_id', userId).paginate(page, limit)
    }
}
