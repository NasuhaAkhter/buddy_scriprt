import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.get('getMyAdByLimit', 'Admin/Ad/AdController.getMyAdByLimit')
  Route.post('/deleteAd', 'Admin/Ad/AdController.deleteAd')
  Route.post('/addAnnouncement', 'Admin/Ad/AdController.addAnnouncement')
  Route.get('/getActiveAnnouncement', 'Admin/Ad/AdController.getActiveAnnouncement')
  Route.post('/removeActiveAnnounce', 'Admin/Ad/AdController.removeActiveAnnounce')
  Route.get('/getAllAnnounce', 'Admin/Ad/AdController.getAllAnnounce')
  Route.post('/deleteAnnouncement', 'Admin/Ad/AdController.deleteAnnouncement')
}).prefix('admin-ad').middleware('admin')
