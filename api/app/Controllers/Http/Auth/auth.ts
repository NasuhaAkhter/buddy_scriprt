import Route from '@ioc:Adonis/Core/Route'
Route.group(()=>{
  Route.get('testAuth', 'Auth/AuthController.getAuthByLimit')
  Route.post('signup', 'Auth/AuthController.signup')
  Route.post('/login', 'Auth/AuthController.login')
  Route.get('/getUser', 'Auth/AuthController.getUser')
  Route.get('/csrfCookie', 'Auth/AuthController.csrfCookie')
  Route.get('/logout', 'Auth/AuthController.logout')
  Route.post('/sendResetToken', 'Auth/AuthController.sendResetToken')
  Route.post('/verifyCode', 'Auth/AuthController.verifyCode')
  Route.post('/passwordReset', 'Auth/AuthController.passwordReset')
  Route.get('/getCountry', 'Auth/AuthController.getCountry')
  Route.post('/verifyEmail', 'Auth/AuthController.verifyEmail')
  Route.post('/resendEmail', 'Auth/AuthController.resendEmail')
  // Route.post('/deleteAccount', 'Auth/AuthController.deleteAccount')
}).prefix('auth');

Route.group(()=>{
  Route.get('testAuth', 'Auth/AuthController.getAuthByLimit')
  Route.post('signup', 'Auth/AuthController.signup')
  Route.post('/login', 'Auth/AuthController.apiLogin')
  Route.get('/getUser', 'Auth/AuthController.getUserApp')
  Route.get('/csrfCookie', 'Auth/AuthController.csrfCookie')
  Route.get('/logout', 'Auth/AuthController.appLogout')

  Route.post('/sendResetToken', 'Auth/AuthController.sendResetToken')
  Route.post('/verifyCode', 'Auth/AuthController.verifyCode')
  Route.post('/passwordReset', 'Auth/AuthController.passwordReset')
  Route.get('/getCountry', 'Auth/AuthController.getCountry')
  Route.post('/verifyEmail', 'Auth/AuthController.verifyEmail')
  Route.post('/resendEmail', 'Auth/AuthController.resendEmail')
  // Route.post('/deleteAccount', 'Auth/AuthController.deleteAccount')

}).prefix('app/auth')

Route.post('auth/deleteAccount', 'Auth/AuthController.deleteAccount').middleware('auth')
Route.post('app/auth/deleteAccount', 'Auth/AuthController.deleteAccount').middleware('auth:api')



