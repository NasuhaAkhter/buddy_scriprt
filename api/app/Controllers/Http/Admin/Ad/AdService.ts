import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdQuery from './AdQuery';
import CommonService from '../../Common/commonService';

export default class AdService {
    private adQuery : AdQuery
    private commonService : CommonService


    constructor(){
      this.adQuery = new AdQuery
      this.commonService = new CommonService
    }

    public async getMyAdByLimit(ctx: HttpContextContract) : Promise<any>{
      let data = ctx.request.all()
      let fData = await this.commonService.formatedData(data)
      const event = await this.adQuery.getMyAdByLimit(fData)
      const eventCount = await this.adQuery.adCount()
      return ctx.response.json({
        event, eventCount
      })
   }



  public async deleteAd(ctx :HttpContextContract) : Promise<any>{
    let data = ctx.request.all()
    let check :any= await ctx.auth.use('web').authenticate()
    if(!check || check.id !=data.admin_id || check.userType != 1){
      return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
    }

    return this.adQuery.deleteAd('id',data.adId)

  }

  public async addAnnouncement(ctx :HttpContextContract) : Promise<any>{
    let data = ctx.request.all()
    let check :any= await ctx.auth.use('web').authenticate()
    if(!check || check.userType != 1){
      return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
    }
    data.user_id = check.id;
    return this.adQuery.addAnnouncement(ctx)

  }

  public async getActiveAnnouncement(){
    return this.adQuery.getActiveAnnouncement()
  }

  public async removeActiveAnnounce(ctx){
    return this.adQuery.removeActiveAnnounce(ctx)
  }

  public async getAllAnnounce(ctx){
    let data = ctx.request.all()
    let announce = await this.commonService.formatedData(data)
    let announcement = await this.adQuery.getAllAnnounce(announce)
    return announcement
    // let pageCount = await this.adQuery.pageCount()
    return ctx.response.send({announcement})
  }

  public async deleteAnnouncement(ctx){
    return this.adQuery.deleteAnnouncement(ctx)
  }

};
