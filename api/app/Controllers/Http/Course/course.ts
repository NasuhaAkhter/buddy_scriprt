import Route from '@ioc:Adonis/Core/Route'
Route.group(()=>{
  Route.get('get/allCourseType', 'Course/CourseController.getAllCourseType')
  Route.get('get/allCourseTypeCount', 'Course/CourseController.getAllCourseTypeCount')
  Route.get('get/:type', 'Course/CourseController.getCourseByType')
  Route.get('get/details/:id', 'Course/CourseController.getCourseDetailsById')
  Route.get('get/contents/:id', 'Course/CourseController.getCourseContentsById')

}).prefix('course')


    //App-routes
Route.group(()=>{
  Route.get('get/allCourseType', 'Course/CourseController.getAllCourseType')
  Route.get('get/allCourseTypeCount', 'Course/CourseController.getAllCourseTypeCount')
  Route.get('get/:type', 'Course/CourseController.getCourseByType')
  Route.get('get/details/:id', 'Course/CourseController.getCourseDetailsByAppId')
  Route.get('get/contents/:id', 'Course/CourseController.getCourseContentsById')
}).prefix('app/course')

Route.post('course/payment/web', 'Course/CourseController.coursePaymentWeb').middleware('auth')
Route.post('app/course/payment/app', 'Course/CourseController.coursePaymentApp').middleware('auth:api')
