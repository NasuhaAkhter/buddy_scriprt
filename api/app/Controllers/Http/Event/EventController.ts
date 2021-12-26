import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EventService from './EventService';
import EventValidator from './EventValidator';
export default class EventController {
  private eventService : EventService
  private eventValidator : EventValidator
  constructor () {
    this.eventService =  new EventService()
    this.eventValidator =  new EventValidator()
  }
  public async getEventByLimit(ctx : HttpContextContract) {
    await this.eventValidator.validateEventSchema(ctx)
    return this.eventService.getEventByLimit(ctx)
  }

  
  async createEvent(ctx : HttpContextContract){
    await this.eventValidator.validateAddEventSchema(ctx)
    return this.eventService.createEvent(ctx)
  }
  async editEvent(ctx : HttpContextContract){
    await this.eventValidator.validateAddEventSchema(ctx)
    return this.eventService.editEvent(ctx)
 }
  
 async deleteEvent(ctx :HttpContextContract){
  try {
    let validatedData :any = await this.eventValidator.validateDeleteSchema(ctx)
    ctx.request.all().event_id = validatedData.event_id
    return this.eventService.deleteEvent(ctx)
  } catch (error) {
    return ctx.response.status(422).send(error.messages)
  }
 }
 
  async getAllEvent(ctx : HttpContextContract){
    return this.eventService.getAllEvent(ctx)
  }
  async getEventDetails(ctx : HttpContextContract){
    return this.eventService.getEventDetails(ctx)
  }
  public async uploadEventPic(ctx : HttpContextContract) {
    return this.eventService.uploadEventPic(ctx)
  }

  // INVITE
  public async addMember(ctx : HttpContextContract) {
    return this.eventService.addMember(ctx)
  }
  public async goingInterested(ctx : HttpContextContract) {
    return this.eventService.goingInterested(ctx)
  }
  public async getEventEditDetails(ctx : HttpContextContract) {
    return this.eventService.getEventEditDetails(ctx)
  }
  public async searchInviteMember(ctx : HttpContextContract) {
    return this.eventService.searchInviteMember(ctx)
  }
  public async getAllInvitedMembers(ctx : HttpContextContract) {
    return this.eventService.getAllInvitedMembers(ctx)
  }
  public async getAllMembers(ctx : HttpContextContract) {
    return this.eventService.getAllMembers(ctx)
  }
  public async accecptInvite(ctx : HttpContextContract) {
    return this.eventService.accecptInvite(ctx)
  }
  public async cancelInvite(ctx : HttpContextContract) {
    return this.eventService.cancelInvite(ctx)
  }
}
