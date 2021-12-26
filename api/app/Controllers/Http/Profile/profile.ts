import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.get('getProfile', 'Profile/ProfileController.getProfile')
  Route.get('getSearchFriend', 'Profile/ProfileController.getSearchFriend')
  Route.post('saveName', 'Profile/ProfileController.saveName')
  // load friends for profile page
  Route.get('getFriendLists/:username', 'Profile/ProfileController.getFriendLists')
  // load friend for chats
  Route.get('getFriendListsForChat', 'Profile/ProfileController.getFriendListsForChat')
  Route.get('peopleList', 'Profile/ProfileController.peopleList')
  Route.get('blockedPeopleList', 'Profile/ProfileController.blockedPeopleList')
  Route.get('getPeopleListBySearch', 'Profile/ProfileController.getPeopleListBySearch')
  Route.post('friendRequest', 'Profile/ProfileController.friendRequest')
  Route.get('getNotification', 'Profile/ProfileController.getNotification')
  Route.post('unSeenNoti', 'Profile/ProfileController.unSeenNoti')
  Route.post('seenNoti', 'Profile/ProfileController.seenNoti')
  Route.post('deleteNoti', 'Profile/ProfileController.deleteNoti')
  Route.get('markAsReadAll', 'Profile/ProfileController.markAsReadAll')
  
  

  Route.get('getFriendRequests', 'Profile/ProfileController.getFriendRequests')
  Route.post('resetFriend', 'Profile/ProfileController.resetFriend')
  Route.post('deleteRequest', 'Profile/ProfileController.deleteRequest')
  Route.post('uploadUserPic', 'Profile/ProfileController.uploadUserPic')
  Route.post('darkModeChange', 'Profile/ProfileController.darkModeChange')
  
  
  Route.post('blockUser', 'Profile/ProfileController.blockUser')
  Route.post('unBlockUser', 'Profile/ProfileController.unBlockUser')
  
}).prefix('profile').middleware('auth')


    //App-routes
Route.group(()=>{
  Route.get('blockedPeopleList', 'Profile/ProfileController.blockedPeopleList')
  Route.get('getProfile', 'Profile/ProfileController.getProfile')
  Route.get('getSearchFriend', 'Profile/ProfileController.getSearchFriend')
  Route.post('saveName', 'Profile/ProfileController.saveName')
  // load friends for profile page
  Route.get('getFriendLists/:username', 'Profile/ProfileController.getFriendLists')
  // load friend for chats
  Route.get('getFriendListsForChat', 'Profile/ProfileController.getFriendListsForChat')
  Route.get('peopleList', 'Profile/ProfileController.peopleList')
  Route.post('friendRequest', 'Profile/ProfileController.friendRequest')
  Route.get('getNotification', 'Profile/ProfileController.getNotification')
  Route.get('getPeopleListBySearch', 'Profile/ProfileController.getPeopleListBySearch')
  Route.post('unSeenNoti', 'Profile/ProfileController.unSeenNoti')
  Route.post('deleteNoti', 'Profile/ProfileController.deleteNoti')
  Route.post('seenNoti', 'Profile/ProfileController.seenNoti')
  Route.get('getFriendRequests', 'Profile/ProfileController.getFriendRequests')
  Route.post('resetFriend', 'Profile/ProfileController.resetFriend')
  Route.post('deleteRequest', 'Profile/ProfileController.deleteRequest')
  Route.post('uploadUserPic', 'Profile/ProfileController.uploadUserPic')
  Route.post('blockUser', 'Profile/ProfileController.blockUser')
  Route.post('unBlockUser', 'Profile/ProfileController.unBlockUser')
  
}).prefix('app/profile').middleware('auth:api')
