import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.get('testEvent', 'Event/EventController.getEventByLimit')
  Route.get('getAllEvent', 'Event/EventController.getAllEvent')
  Route.post('createEvent', 'Event/EventController.createEvent')
  Route.get('getEventDetails', 'Event/EventController.getEventDetails')
  Route.post('uploadEventPic', 'Event/EventController.uploadEventPic')
  Route.post('addMember', 'Event/EventController.addMember')
  Route.post('goingInterested', 'Event/EventController.goingInterested')
  Route.post('editEvent', 'Event/EventController.editEvent')
  Route.post('deleteEvent', 'Event/EventController.deleteEvent')
  Route.get('searchInviteMember', 'Event/EventController.searchInviteMember')
  Route.get('getEventEditDetails', 'Event/EventController.getEventEditDetails')
  Route.get('getAllInvitedMembers', 'Event/EventController.getAllInvitedMembers')
  Route.get('getAllMembers', 'Event/EventController.getAllMembers')
  Route.post('accecptInvite', 'Event/EventController.accecptInvite')
  Route.post('cancelInvite', 'Event/EventController.cancelInvite')
}).prefix('event').middleware('auth')


    //App-routes
Route.group(()=>{
  Route.get('testEvent', 'Event/EventController.getEventByLimit')
  Route.get('getAllEvent', 'Event/EventController.getAllEvent')
  Route.post('createEvent', 'Event/EventController.createEvent')
  Route.post('editEvent', 'Event/EventController.editEvent')
  Route.post('deleteEvent', 'Event/EventController.deleteEvent')
  Route.get('getEventDetails', 'Event/EventController.getEventDetails')
  Route.post('uploadEventPic', 'Event/EventController.uploadEventPic')
  Route.post('addMember', 'Event/EventController.addMember')
  Route.post('goingInterested', 'Event/EventController.goingInterested')
  Route.get('searchInviteMember', 'Event/EventController.searchInviteMember')
  Route.get('getEventEditDetails', 'Event/EventController.getEventEditDetails')
  Route.get('getAllInvitedMembers', 'Event/EventController.getAllInvitedMembers')
  Route.get('getAllMembers', 'Event/EventController.getAllMembers')
  Route.post('accecptInvite', 'Event/EventController.accecptInvite')
  Route.post('cancelInvite', 'Event/EventController.cancelInvite')
}).prefix('app/event').middleware('auth:api')
