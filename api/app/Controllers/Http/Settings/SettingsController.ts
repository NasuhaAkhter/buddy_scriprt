import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SettingsService from './SettingsService';
import SettingsValidator from './SettingsValidator';
export default class SettingsController {
  private settingsService : SettingsService
  private settingsValidator : SettingsValidator
  constructor () {
    this.settingsService =  new SettingsService()
    this.settingsValidator =  new SettingsValidator()
  }
  public async getExampleByLimit(ctx : HttpContextContract) {
    await this.settingsValidator.validateSettingsSchema(ctx)
    return this.settingsService.getExampleByLimit(ctx)
  }

  public async profileSettingUpdate(ctx : HttpContextContract) {
    let data = ctx.request.all()
    let website = ctx.auth.user?.website

    if((website != data.website) && data.website){
      await this.settingsValidator.websiteValidator(ctx)
    }
    if(!data.first_name || !data.last_name){
      await this.settingsValidator.pSettingUpdateNameValidator(ctx)
    }
    return this.settingsService.profileSettingUpdate(ctx)
  }
  public async profileSettingDefaultFeedUpdate(ctx : HttpContextContract) {
    return this.settingsService.profileSettingUpdate(ctx)
  }
  public async emailVerify(ctx : HttpContextContract) {
     return this.settingsService.emailVerify(ctx)
  }
  public async emailUpdate(ctx : HttpContextContract) {
    let userEmail = ctx.auth.user?.email
    let data = ctx.request.all()
    if((userEmail != data.email) && data.email){
      await this.settingsValidator.profileSettingUpdateEmail(ctx)
      return await this.settingsService.verifyEmail(ctx)
    }
    return ctx.response.status(404).send({msg: "Successful!!"})
   }

  public async changePassword(ctx : HttpContextContract) {
    await this.settingsValidator.changePassword(ctx)
    return this.settingsService.changePassword(ctx)
  }

  public async getSingleOgimage() {
    return this.settingsService.getSingleOgimage()
  }

}
