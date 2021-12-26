import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.post('storeGroup', 'Group/GroupController.storeGroup')
  Route.post('updateGroup', 'Group/GroupController.updateGroup')
  Route.post('addMember', 'Group/GroupController.addMember')
  Route.post('uploadGroupPic', 'Group/GroupController.uploadGroupPic')
  Route.get('getCategory', 'Group/GroupController.getCategory')
  Route.post('removeGroup', 'Group/GroupController.removeGroup')
  Route.post('makeAdmin', 'Group/GroupController.makeAdmin')
  Route.post('removeAdminRole', 'Group/GroupController.removeAdminRole')
  Route.get('getGroupList', 'Group/GroupController.getGroupList')
  
  Route.get('getSingleGroup', 'Group/GroupController.getSingleGroup')
  Route.get('getSearchFriend', 'Group/GroupController.getSearchFriend')
  Route.get('getFriendNotGroupMember', 'Group/GroupController.getFriendNotGroupMember')
  Route.post('leaveGroup', 'Group/GroupController.leaveGroup')
  Route.post('joinGroup', 'Group/GroupController.joinGroup')
  Route.post('deleteGroup', 'Group/GroupController.deleteGroup')
  Route.get('globalSearch', 'Group/GroupController.globalSearch')
  Route.get('getSavedPagebyLimit', 'Group/GroupController.getSavedPagebyLimit')
}).prefix('group').middleware('auth')



    //App-routes
Route.group(()=>{
  
  Route.post('storeGroup', 'Group/GroupController.storeGroup')
  Route.post('updateGroup', 'Group/GroupController.updateGroup')
  Route.post('addMember', 'Group/GroupController.addMember')
  Route.post('uploadGroupPic', 'Group/GroupController.uploadGroupPic')
  Route.get('getCategory', 'Group/GroupController.getCategory')
  Route.post('removeGroup', 'Group/GroupController.removeGroup')
  Route.post('makeAdmin', 'Group/GroupController.makeAdmin')
  Route.post('removeAdminRole', 'Group/GroupController.removeAdminRole')
  Route.get('getGroupList', 'Group/GroupController.getGroupList')
  
  Route.get('getSingleGroup', 'Group/GroupController.getSingleGroup')
  Route.get('getSearchFriend', 'Group/GroupController.getSearchFriend')
  Route.get('getFriendNotGroupMember', 'Group/GroupController.getFriendNotGroupMember')
  Route.post('leaveGroup', 'Group/GroupController.leaveGroup')
  Route.post('joinGroup', 'Group/GroupController.joinGroup')
  Route.post('deleteGroup', 'Group/GroupController.deleteGroup')
  Route.get('globalSearch', 'Group/GroupController.globalSearch')
  Route.get('getSavedPagebyLimit', 'Group/GroupController.getSavedPagebyLimit')
  
}).prefix('app/group').middleware('auth:api')
