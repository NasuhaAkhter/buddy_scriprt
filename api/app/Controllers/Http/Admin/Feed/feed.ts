import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{

  //feed-main-routes
  Route.get('getFeedByLimit', 'Admin/Feed/FeedController.getFeedByLimit')

  Route.get('/getSingleFeed/:id', 'Admin/Feed/FeedController.getSingleFeed')
  Route.post('/deleteFeed', 'Admin/Feed/FeedController.deleteFeed')

  //Group-routes
  Route.get('getGroupFeedByLimit', 'Admin/Feed/FeedController.getGroupFeedByLimit')

  //Page-routes
  Route.get('getPageFeedWithlimit', 'Admin/Feed/FeedController.getPageFeedWithlimit')

  //Event-routes
  Route.get('getEventFeedWithlimit', 'Admin/Feed/FeedController.getEventFeedWithlimit')


  //comments-routes
  Route.get('getCommentwithLimit/:id', 'Admin/Feed/FeedController.getCommentwithLimit')
  Route.post('/deleteComment', 'Admin/Feed/FeedController.deleteComment')

  //reply-routes
  Route.get('getReplieswithLimit/:id', 'Admin/Feed/FeedController.getReplieswithLimit')
  Route.post('/deleteReply', 'Admin/Feed/FeedController.deleteReply')

  //Reports-routes
  Route.get('getReportWithLimit', 'Admin/Feed/FeedController.getReportWithLimit')
  Route.post('/deleteReport', 'Admin/Feed/FeedController.deleteReport')
  Route.post('/deleteContent', 'Admin/Feed/FeedController.deleteContent')
  Route.post('editStaticPages', 'Admin/Feed/FeedController.editStaticPages')

  //Og-image
  Route.get('getOgimage', 'Admin/Feed/FeedController.getOgimage')
  Route.post('editOgimage', 'Admin/Feed/FeedController.editOgimage')


}).prefix('admin-feed').middleware('admin')
