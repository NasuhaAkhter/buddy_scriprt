import Route from '@ioc:Adonis/Core/Route'
Route.group(()=>{
  Route.get('testCampaign', 'Campaign/CampaignController.getCampaignByLimit')
  Route.get('getCampaignList', 'Campaign/CampaignController.getCampaignList')
  Route.get('getSingleCampaignDetails', 'Campaign/CampaignController.getSingleCampaignDetails')
  Route.get('getSingleCampaignEvents', 'Campaign/CampaignController.getSingleCampaignEvents')
  Route.get('getPageByUserId', 'Campaign/CampaignController.getPageByUserId')
  Route.get('getFeedByPageId', 'Campaign/CampaignController.getFeedByPageId')
  Route.post('eventActionTrack', 'Campaign/CampaignController.eventActionTrack')
  Route.post('createCampaign', 'Campaign/CampaignController.createCampaign')
  Route.post('updateCampaign', 'Campaign/CampaignController.updateCampaign')
  Route.post('stopCampaign', 'Campaign/CampaignController.stopCampaign')
  Route.post('restartCampaign', 'Campaign/CampaignController.restartCampaign')
}).prefix('campaign').middleware('auth')


    //App-routes
Route.group(()=>{
  Route.post('createCampaign', 'Campaign/CampaignController.createCampaign')
  Route.post('updateCampaign', 'Campaign/CampaignController.updateCampaign')
  Route.post('stopCampaign', 'Campaign/CampaignController.stopCampaign')
  Route.post('restartCampaign', 'Campaign/CampaignController.restartCampaign')
  Route.get('testCampaign', 'Campaign/CampaignController.getCampaignByLimit')
  Route.get('eventActionTrack', 'Campaign/CampaignController.eventActionTrack')
  Route.get('getCampaignList', 'Campaign/CampaignController.getCampaignList')
  Route.get('getSingleCampaignDetails', 'Campaign/CampaignController.getSingleCampaignDetails')
  Route.get('getSingleCampaignEvents', 'Campaign/CampaignController.getSingleCampaignEvents')
  Route.get('getPageByUserId', 'Campaign/CampaignController.getPageByUserId')
  Route.get('getFeedByPageId', 'Campaign/CampaignController.getFeedByPageId')
}).prefix('app/campaign').middleware('auth:api')
