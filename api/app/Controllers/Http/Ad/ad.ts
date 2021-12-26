import Route from '@ioc:Adonis/Core/Route'




Route.group(()=>{
  Route.post('/add', 'Ad/AdController.addAd')
  
  Route.post('/stop', 'Ad/AdController.stopAd')
  Route.post('/restart', 'Ad/AdController.adRestart')
  // Route.get('testAd', 'Ad/AdController.getAdByLimit')
  // Route.get('getAddLists', 'Ad/AdController.getAddLists')

}).prefix('ad').middleware('auth')

Route.group(()=>{
  Route.post('/add', 'Ad/AdController.addAd')
  
  Route.post('/stop', 'Ad/AdController.stopAd')
  Route.post('/restart', 'Ad/AdController.adRestart')

}).prefix('app/ad').middleware('auth:api')
