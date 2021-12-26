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

  async getAllEvent(ctx: HttpContextContract){
      return this.eventService.getAllEvent(ctx)
  }


  
  async getSingleEvent(ctx: HttpContextContract){
    return this.eventService.getSingleEvent(ctx)
 }
  
  async deleteEvent(ctx: HttpContextContract){
    return this.eventService.deleteEvent(ctx)
 }
  

 
  async getCampaignList(ctx: HttpContextContract){
      return this.eventService.getCampaignList(ctx)
  }

  
  async getTopupWithLimit(ctx: HttpContextContract){
      return this.eventService.getTopupWithLimit(ctx)
  } 
  
  async deleteCompaign(ctx: HttpContextContract){
    return this.eventService.deleteCompaign(ctx)
  } 
 
  
  
  async getAdRateswithLimit(ctx: HttpContextContract){
      return this.eventService.getAdRateswithLimit(ctx)
  }
    
  async deleteRate(ctx: HttpContextContract){
    return this.eventService.deleteRate(ctx)
  }
  
  async editRate(ctx: HttpContextContract){
    await this.eventValidator.validateRateSchema(ctx)
    return this.eventService.editRate(ctx)
  }
  
  async createRate(ctx: HttpContextContract){
    await this.eventValidator.validateCreateRateSchema(ctx)
    return this.eventService.createRate(ctx)
  }
 
}
