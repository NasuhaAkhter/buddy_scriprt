import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.get('getMyGroupByLimit', 'Admin/Group/GroupController.getMyGroupByLimit')
  Route.get('/getSingleGroup/:id', 'Admin/Group/GroupController.getSingleGroup')
  Route.post('/deleteGroup', 'Admin/Group/GroupController.deleteGroup')
}).prefix('admin-group').middleware('admin')
