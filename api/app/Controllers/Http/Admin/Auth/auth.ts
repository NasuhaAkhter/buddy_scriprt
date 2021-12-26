import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  
  Route.post('/login', 'Admin/Auth/AuthController.login')
  
}).prefix('admin')
 