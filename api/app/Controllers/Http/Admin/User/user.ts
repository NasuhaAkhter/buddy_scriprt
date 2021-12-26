import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{

  Route.get('/getUserByLimit', 'Admin/User/UserController.getUserByLimit')
  Route.get('/getSingleUser/:id', 'Admin/User/UserController.getSingleUser')
  Route.post('/deleteUser', 'Admin/User/UserController.deleteUser')
  Route.post('/removefromAdmin', 'Admin/User/UserController.removefromAdmin')
  Route.post('/editUser', 'Admin/User/UserController.editUser')
  Route.post('/editAdminUser', 'Admin/User/UserController.editAdminUser')
  Route.post('/editAdminPassword', 'Admin/User/UserController.editAdminPassword')

  //user-transactions
  Route.get('/getUserTrans', 'Admin/User/UserController.getUserTrans')
  Route.post('/updateWallet', 'Admin/User/UserController.updateWallet')
  Route.get('/getBlockedUser', 'Admin/User/UserController.getBlockedUser')

}).prefix('admin-user').middleware('admin')
