import Route from '@ioc:Adonis/Core/Route'


Route.group(()=>{
  Route.get('testExample', 'Example/ExampleController.getExampleByLimit')
  Route.post('emailUpdate', 'Settings/SettingsController.emailUpdate')
  Route.post('emailVerify', 'Settings/SettingsController.emailVerify')
  Route.post('profileSettingUpdate', 'Settings/SettingsController.profileSettingUpdate')
  Route.post('profileSettingDefaultFeedUpdate', 'Settings/SettingsController.profileSettingDefaultFeedUpdate')
  Route.post('changePassword', 'Settings/SettingsController.changePassword')
}).prefix('settings').middleware('auth')


 Route.get('/settings/getSingleOgimage', 'Settings/SettingsController.getSingleOgimage')
Route.group(()=>{
  Route.post('emailUpdate', 'Settings/SettingsController.emailUpdate')
  Route.post('emailVerify', 'Settings/SettingsController.emailVerify')
  Route.post('changePassword', 'Settings/SettingsController.changePassword')
  Route.post('profileSettingUpdate', 'Settings/SettingsController.profileSettingUpdate')
  Route.post('profileSettingDefaultFeedUpdate', 'Settings/SettingsController.profileSettingDefaultFeedUpdate')
}).prefix('app/settings').middleware('auth:api')
