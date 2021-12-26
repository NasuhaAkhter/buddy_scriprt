import User from 'App/Models/User'
import Campaign from 'App/Models/Campaign'
import Page from 'App/Models/Page'
import Feed from 'App/Models/Feed'
import CampaignEvent from 'App/Models/CampaignEvent'
export default class CampaignQuery{
   public async getUserByLimit(limit : number) : Promise<User[]> {
      const user = User.query().limit(limit)
      return user
   }
   public async getSingleCampaignDetails(id:number){
   return await Campaign.query().where('id', id)
   .withCount('totalAdImpression', (builder) => {
      builder.where('activity_type', 'impression')
   })
   .withCount('totalAdClick', (builder) => {
      builder.where('activity_type', 'click')
   })
   .withCount('totalAdLike', (builder) => {
      builder.where('activity_type', 'like')
   })
   .withCount('totalAdComment', (builder) => {
      builder.where('activity_type', 'comment')
   })
   .first();
   }
   public async getSingleCampaignEvents(id:number,page:number){
   return await CampaignEvent.query().where('ad_id', id).paginate(page,20)
   }
   // 
   public async createCampaign(pageData){
      return await Campaign.create(pageData)
   }

   public async updateCampaign(data, userId){
      return await Campaign.query().where('id', data.id).where('user_id',userId).update(data)
   }
   public async getPageByUserId(uid:number){
      return await Page.query().where('user_id',uid).select('id','page_name')
   }
   public async getCampaignList(uid:number, page:number, limit:number){
      return await Campaign.query().where('user_id',uid).paginate(page, limit)
   }
   public async getFeedByPageId(pid:number,str){
      let d  =  Feed.query().where('page_id',pid).select('id','feed_txt','files').limit(10)
      if(str){
         d.where(builder =>{
            builder.where('feed_txt','like',`%${str}%`);
            builder.orWhere('id',str);
         })
      }
      return d;
   }


   public async createCampaignEvent(data){
      return await CampaignEvent.create(data)
   }
}
