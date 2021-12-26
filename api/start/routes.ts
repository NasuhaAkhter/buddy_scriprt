
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
  Route.post('/uploadImages', 'FilesController.uploadImages')
  Route.post('/uploadImages2', 'FilesController.uploadImages2')
  Route.post('/multipleImageUpload', 'FilesController.multipleImageUpload')
}).middleware('auth')

Route.group(() => {
  Route.post('/uploadImages', 'FilesController.uploadImages')
  Route.post('/uploadImages2', 'FilesController.uploadImages2')
  Route.post('/multipleImageUpload', 'FilesController.multipleImageUpload')
}).prefix('app').middleware('auth:api')

import 'App/Controllers/Http/Auth/auth'
import 'App/Controllers/Http/Feed/feed'
import 'App/Controllers/Http/Comment/comment'
import 'App/Controllers/Http/Profile/profile'
import 'App/Controllers/Http/Chatting/chatting'
import 'App/Controllers/Http/Page/page'
import 'App/Controllers/Http/Group/group'
import 'App/Controllers/Http/Event/event'
import 'App/Controllers/Http/Bill/Bill'
import 'App/Controllers/Http/Campaign/campaign'
import 'App/Controllers/Http/Ad/ad'
import 'App/Controllers/Http/Settings/settings'
import 'App/Controllers/Http/VideoCall/videoCall'
import 'App/Controllers/Http/Course/course'

Route.get('serveVideo', 'FilesController.serveVideo')
Route.get('getobject', 'FilesController.getobject')
//admin-routes
import 'App/Controllers/Http/Admin/Auth/auth'
import 'App/Controllers/Http/Admin/User/user'
import 'App/Controllers/Http/Admin/Group/group'
import 'App/Controllers/Http/Admin/Page/page'
import 'App/Controllers/Http/Admin/Feed/feed'
import 'App/Controllers/Http/Admin/Event/event'
import 'App/Controllers/Http/Admin/Ad/ad'


Route.get('image/:fileName', 'FilesController.serveImage')
Route.get('test/test/file', 'FilesController.testFile')
Route.get('video/:fileName', 'FilesController.serveVideoStream')

Route.get('/', () => {
  return {
    'msg' : 'You have landed in an empty ocean!'
  }
})
