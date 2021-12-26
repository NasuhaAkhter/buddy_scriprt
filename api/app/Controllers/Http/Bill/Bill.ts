import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.get('testBill', 'Bill/BillController.getBillByLimit')
  Route.get('getTransactionList','Bill/BillController.getTransactionList')
  Route.get('getCurrentBalance', 'Bill/BillController.getCurrentBalance')
  Route.post('submit_payment', 'Bill/BillController.submit_payment')

}).prefix('bill').middleware('auth')


    //App-routes
Route.group(()=>{
  Route.get('testBill', 'Bill/BillController.getBillByLimit')
  Route.get('getTransactionList','Bill/BillController.getTransactionList')
  Route.get('getCurrentBalance', 'Bill/BillController.getCurrentBalance')
  Route.post('submit_payment', 'Bill/BillController.submit_payment')

}).prefix('app/bill').middleware('auth:api')
