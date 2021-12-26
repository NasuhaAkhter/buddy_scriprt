import Route from '@ioc:Adonis/Core/Route'
Route.group(()=>{
  Route.post('createReport', 'Feed/FeedController.createReport')
  Route.post('createFeed', 'Feed/FeedController.createFeed')
  Route.get('getFeed', 'Feed/FeedController.getFeed')
  Route.get('getAdds', 'Feed/FeedController.getAdds')
  Route.post('saveFeedforUser', 'Feed/FeedController.saveFeedforUser')
  Route.post('unsaveFeedforUser', 'Feed/FeedController.unsaveFeedforUser')
  Route.post('createLike', 'Feed/FeedController.createLike')
  Route.post('getLinkPreview', 'Feed/FeedController.getLinkPreview')
  Route.post('uploadImage', 'Feed/FeedController.uploadImage')
  Route.get('getSingleFeed/:id', 'Feed/FeedController.getSingleFeed')
  Route.post('updateFeed', 'Feed/FeedController.updateFeed')
  Route.post('deleteFeed', 'Feed/FeedController.deleteFeed')
}).prefix('feed').middleware('auth')


Route.get('gettest', 'Feed/FeedController.gettest')
// Route.get('testAd', 'Feed/FeedController.testAd')

    //App-routes
Route.group(()=>{
  Route.post('createReport', 'Feed/FeedController.createReport')
  Route.post('createFeed', 'Feed/FeedController.createFeed')
  Route.get('getFeed', 'Feed/FeedController.getFeed')
  Route.post('saveFeedforUser', 'Feed/FeedController.saveFeedforUser')
  Route.post('unsaveFeedforUser', 'Feed/FeedController.unsaveFeedforUser')
  Route.post('createLike', 'Feed/FeedController.createLike')
  Route.post('getLinkPreview', 'Feed/FeedController.getLinkPreview')
  Route.post('uploadImage', 'Feed/FeedController.uploadImage')
  Route.get('getSingleFeed/:id', 'Feed/FeedController.getSingleFeed')
  Route.post('updateFeed', 'Feed/FeedController.updateFeed')
  Route.post('deleteFeed', 'Feed/FeedController.deleteFeed')
}).prefix('app/feed').middleware('auth:api')