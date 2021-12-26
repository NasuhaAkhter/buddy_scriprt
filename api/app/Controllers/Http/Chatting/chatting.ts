import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.post('insertChat', 'Chatting/ChattingController.insertChat')
  Route.post('getChatLists', 'Chatting/ChattingController.getChatLists')
  Route.get('getInbox', 'Chatting/ChattingController.getInbox')
  Route.post('updateSeen', 'Chatting/ChattingController.updateSeen')
  Route.post('deleteSingleMsg', 'Chatting/ChattingController.deleteSingleMsg')
  Route.post('deleteFullConvers', 'Chatting/ChattingController.deleteFullConvers')
}).prefix('chatting').middleware('auth')


    //App-routes
Route.group(()=>{
  Route.post('insertChat', 'Chatting/ChattingController.insertChat')
  Route.post('getChatLists', 'Chatting/ChattingController.getChatLists')
  Route.get('getInbox', 'Chatting/ChattingController.getInbox')
  Route.post('updateSeen', 'Chatting/ChattingController.updateSeen')
  Route.post('deleteSingleMsg', 'Chatting/ChattingController.deleteSingleMsg')
  Route.post('deleteFullConvers', 'Chatting/ChattingController.deleteFullConvers')
  
}).prefix('app/chatting').middleware('auth:api')
