import Route from '@ioc:Adonis/Core/Route'
Route.group(()=>{
  Route.post('getCallerInformation', 'VideoCall/VideoCallController.getCallerInformation')
}).prefix('videoCall').middleware('auth')


    //App-routes
Route.group(()=>{
  Route.post('getCallerInformation', 'VideoCall/VideoCallController.getCallerInformation')
}).prefix('app/videoCall').middleware('auth:api')
