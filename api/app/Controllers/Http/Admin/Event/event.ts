import Route from '@ioc:Adonis/Core/Route'
Route.group(()=>{
  Route.get('getAllEvent', 'Admin/Event/EventController.getAllEvent')
  Route.get('getSingleEvent/:id', 'Admin/Event/EventController.getSingleEvent')
  Route.post('deleteEvent', 'Admin/Event/EventController.deleteEvent')
  
  //campaigns-routs
  Route.get('getCampaignList', 'Admin/Event/EventController.getCampaignList')
  Route.post('deleteCompaign', 'Admin/Event/EventController.deleteCompaign')
  
  //topup-routs
  Route.get('getTopupWithLimit', 'Admin/Event/EventController.getTopupWithLimit')
  
  //ad_rates-routs
  Route.get('getAdRateswithLimit', 'Admin/Event/EventController.getAdRateswithLimit')
  Route.post('deleteRate', 'Admin/Event/EventController.deleteRate')
  Route.post('createRate', 'Admin/Event/EventController.createRate')
  Route.post('editRate', 'Admin/Event/EventController.editRate')
  
}).prefix('admin-event').middleware('admin')
