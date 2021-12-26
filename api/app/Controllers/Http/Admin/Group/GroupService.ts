import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GroupQuery from './GroupQuery';
import CommonService from '../../Common/commonService';

export default class GroupService {
    private groupQuery : GroupQuery
    private commonService : CommonService


    constructor(){ 
      
      this.groupQuery = new GroupQuery
      this.commonService = new CommonService
    }

    public async getMyGroupByLimit(ctx: HttpContextContract) : Promise<any>{
      let data = ctx.request.all()
      let fData = await this.commonService.formatedData(data)
      const group = await this.groupQuery.getMyGroupByLimit(fData)
      const groupCount = await this.groupQuery.groupCount()
      return ctx.response.json({
        group, groupCount
      })
   }
   
       
   public async getSingleGroup(ctx): Promise<any>{
    let id = ctx.params.id
      let user :any = await this.groupQuery.getSingleGroup('id',id)
      return user
  }
  
  public async deleteGroup(ctx :HttpContextContract) : Promise<any>{
    let data = ctx.request.all()
    let check :any= await ctx.auth.use('web').authenticate()
    if(!check || check.id !=data.admin_id || check.userType != 1){
      return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
    }
    
    return this.groupQuery.deleteGroup('id',data.groupId)
      
  }
    
};
