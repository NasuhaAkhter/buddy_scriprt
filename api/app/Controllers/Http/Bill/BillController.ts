import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BillService from './BillService';
import BillValidator from './BillValidator';
import Stripe from 'stripe'
export default class BillController {
  private billService : BillService
  private billValidator : BillValidator
  constructor () {
    this.billService =  new BillService()
    this.billValidator =  new BillValidator()
  }
  public async getBillByLimit(ctx : HttpContextContract) {
    await this.billValidator.validateBillSchema(ctx)
    return this.billService.getBillByLimit(ctx)
  }
  public async getCurrentBalance(ctx : HttpContextContract) {
     return this.billService.getCurrentBalance(ctx)
  }
  public async getTransactionList(ctx : HttpContextContract) {
     return this.billService.getTransactionList(ctx)
  }

  public async submit_payment(ctx: HttpContextContract) {
    let data = ctx.request.all()
    // return data
    // let user = ctx.auth.user
    if (!data.token || (!data.amount || data.amount<1)){
        return ctx.response.status(422).send("Invalid request")
      }

    // const stripe = new Stripe('sk_test_51HFc6rHJ4ZmcYBNIlwaqCNgtUiJp8c5TjvM7EpcVd6DAk0TjpEHIyT3Tl1peEYsVArAMEiTXN7kEjXDOx69xNavt00Zvamvfjd', {
    // const stripe = new Stripe('sk_test_hr08ttEk3iHrPIz2rGRxcdGy', {
    //   const stripe = new Stripe('sk_test_hGkRqRvr02t40RLHCg3C06xI00BunBziTh', {
    //   apiVersion: '2020-08-27'
    // });
      const stripe = new Stripe('sk_test_51JReQmHIkucU8UZ04ipNsEh7E9uF5NiZ1Zts3nXK1avHdCrxZfKyUkE2xSwW1xLc9Vnys8QQB7HvTSTYD3Ss2ChB00OPITv1EH', {
      apiVersion: '2020-08-27'
    });

    // const transaction = stripe.charges.retrieve('ch_1J0oeaHJ4ZmcYBNIsEJ4trnt', {
    //   api_key: 'sk_test_51HFc6rHJ4ZmcYBNIlwaqCNgtUiJp8c5TjvM7EpcVd6DAk0TjpEHIyT3Tl1peEYsVArAMEiTXN7kEjXDOx69xNavt00Zvamvfjd'
    // });

    // return transaction

    let user = await ctx.auth.use('web').authenticate()
    let percentage = (parseFloat(data.amount) *2)/100

    let amount = parseFloat(data.amount + percentage + 1.8) * 100
    
        const customer = await stripe.charges.create({
          amount: amount,
          currency:'USD',
          source: data.token,
          
          description: `
          Id : ${user.id} \n
          Name : ${user.first_name} ${user.last_name}\n
          Email : ${user.email}\n
          Type : Top-up\n
        `,
          metadata:{
            id:user.id,
            firstName:user.first_name,
            lastName:user.last_name,
            email:user.email,
          },
        
          
          
         

        });
        

        if (customer && customer.status =='succeeded'){

          return this.billService.makePayment({
              amount: data.amount,
              tax: percentage,
              user_id: user.id,
              receipt_url: customer.receipt_url,
              payment_id: customer.id,
              card_number: customer.payment_method_details?.card?.last4,
              alldata: customer
          })
        }
        else {
          return ctx.response.status(422).send("Invalid request")
        }
  }
}
