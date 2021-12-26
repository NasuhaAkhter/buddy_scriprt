// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CommonService from '../../Common/commonService';
import EventQuery from './EventQuery';

export default class EventService {
    private eventQuery : EventQuery
    private commonService : CommonService
    constructor(){
      this.eventQuery = new EventQuery
      this.commonService = new CommonService
    }

    public async getAllEvent(ctx :any){
     
      let data = ctx.request.all()
      let fData = await this.commonService.formatedData(data)
        let event = await this.eventQuery.getAllEvent(fData)
        let eventCount = await this.eventQuery.pageFeedCount()
        return ctx.response.send({event, eventCount})
      
    }

    
        
    public async getSingleEvent(ctx): Promise<any>{
      let id = ctx.params.id
        let event :any = await this.eventQuery.getSingleEvent('id',id)
        return event
    }

    
    public async deleteEvent(ctx :any): Promise<any>{
      let data = ctx.request.all()
      let auth = await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.admin_id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }
      return this.eventQuery.deleteEvent('id', data.eventId)
        
    }

    
    //campaigns-functions
    
    public async getCampaignList(ctx :any){
      let data = ctx.request.all()
      let  type = data.type?data.type:''
      let fData = await this.commonService.formatedData(data)
        let event = await this.eventQuery.getCampaignList(fData, type)
        let eventCount = await this.eventQuery.campaignCount(type)
        return ctx.response.send({event, eventCount})
      
    }    
    
    
    public async deleteCompaign(ctx :any): Promise<any>{
      let data = ctx.request.all()
      let auth = await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.admin_id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }
      return this.eventQuery.deleteCompaign('id', data.compaignId)
        
    }

    
    public async getTopupWithLimit(ctx :any){
      let data = ctx.request.all()
      let transId = data.trans_id?data.trans_id:0;
      
      let fData = await this.commonService.formatedData(data)
        let event = await this.eventQuery.getTopupWithLimit(fData,transId)
        for(let i of event){
          i.json = JSON.parse(i.json)
        }
        let eventCount = await this.eventQuery.topupCount()
        return ctx.response.send({event, eventCount})
      
    } 
    
    
    public async getAdRateswithLimit(ctx :any){
      let data = ctx.request.all()
      let fData = await this.commonService.formatedData(data)
        let event = await this.eventQuery.getAdRateswithLimit(fData)
        let eventCount = await this.eventQuery.rateCount()
        return ctx.response.send({event, eventCount})
    }    
    
    public async deleteRate(ctx :any): Promise<any>{
      let data = ctx.request.all()
      let auth = await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.admin_id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }
      return this.eventQuery.deleteRate('id', data.rateId)
        
    }
    
    public async editRate(ctx :any): Promise<any>{
      let data = ctx.request.all()
      let auth = await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.admin_id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }
      
      return this.eventQuery.editRate('id',data.uId, {
        ad_type: data.ad_type,
        activity_type: data.activity_type,
        amount: data.amount,
      })
        
    }
    
    public async createRate(ctx :any): Promise<any>{
      let data = ctx.request.all()
      let auth = await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.admin_id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }
      
      return this.eventQuery.createRate({
        ad_type: data.ad_type,
        activity_type: data.activity_type,
        amount: data.amount,
      })
        
    }

 
};
