import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BillQuery from './BillQuery';
export default class BillService {
    private billQuery : BillQuery
    constructor(){
      this.billQuery = new BillQuery
    }
    public async getBillByLimit(ctx : HttpContextContract){
      const limit = ctx.request.all().limit
      const user = await this.billQuery.getUserByLimit(limit)
      return user
   }
   public async getCurrentBalance(ctx : HttpContextContract){
    let userId:any = ctx.auth.user?.id

    let balance =  await this.billQuery.getCurrentBalance(userId);
    if(balance.currentBalance) return balance;
    return {
      currentBalance: 0
    }
   }
   public async getTransactionList(ctx : HttpContextContract){
    let userId:any = ctx.auth.user?.id
    let data = ctx.request.all()
    return await this.billQuery.getTransactionList(userId, data.page, data.limit)
   }

   public async makePayment(data: any){
    return this.billQuery.makePayment({
      user_id:data.user_id,
      amount: data.amount ? data.amount : 0,
      reason: 'Top up',
      tax: data.tax,
      receipt_url: data.receipt_url,
      payment_id: data.payment_id,
      card_number: data.card_number,
      json: JSON.stringify(data.alldata)
    })
   }
};
