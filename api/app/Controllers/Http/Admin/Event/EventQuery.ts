
import Event from '../../../../Models/Event'
import Compaign from '../../../../Models/Campaign'
import Transection from '../../../../Models/Transection'
import AdRate from '../../../../Models/AdRate'
import moment from 'moment'

export default class EventQuery{

    public async getAllEvent(data :any) {
      let str  =data.str;
      let id  =data.id;

      let q = Event.query().orderBy(data.colName, data.order).preload('user', (query) => {
        query.select('first_name','last_name')
      }).withCount('event', (q3) => {
        q3.where('status','going').as('egoing')
      }).withCount('event', (q4) => {
        q4.where('status','interested').as('einterested')
      }).withCount('feed')
          // .select('id','event_name','start_time','end_time','created_at')
      if(str){
          q.where((query) => {
            query.whereRaw("event_name  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          }).orWhereHas('user', (builder) => {
            builder.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
          })
      }
      if(id){
        q.where('id', id);
      }
      let event = q.paginate(data.event, data.eventSize);
      return event;
    }



    pageFeedCount(){
      return Event.query().pojo<{ total: number }>().count('id as total').first()
     }


    public async deleteEvent(key:string , value :string) {
      return Event.query().where(key, value).delete();
    }


    public async getSingleEvent(key:string , value :string) {
      return Event.query().where(key, value).first();
    }

   //Compaign-functions
    public async getCampaignList(data :any , type) {
      let now = moment().format('YYYY-MM-DD');
      let str  =data.str;
      let q = Compaign.query().orderBy(data.colName, data.order).preload('user', (query) => {
        query.select('first_name','last_name')
      })
          // .select('id','name','budget','start_date','end_date','created_at')
      if(str){
          q.where((query) => {
            query.whereRaw("name  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          }).orWhereHas('user', (builder) => {
            builder.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
          })
      }
      if(type == 'incoming'){
        q.where('start_date_time' ,'>' , now)
      }else{
        q.where('status' , 'Running')
      }
      let event = q.paginate(data.event, data.eventSize);
      return event;
    }


    public async deleteCompaign(key:string , value :string) {
      return Compaign.query().where(key, value).delete();
    }



    campaignCount(type){
      let now = moment().format('YYYY-MM-DD');
      if(type == 'incoming'){
        return Compaign.query().pojo<{ total: number }>().where('start_date_time', '>' , now).count('id as total').first()
      }else{
        return Compaign.query().pojo<{ total: number }>().where('status', 'Running').count('id as total').first()
      }
     }

    public async getTopupWithLimit(data :any, uId:any) {
      let str  =data.str;
      let q = Transection.query().orderBy(data.colName, data.order).preload('user', (query) => {
        query.select('first_name','last_name')
      })
      if(str){
          q.where((query) => {
            query.whereRaw("reason  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          }).orWhereHas('user', (builder) => {
            builder.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
          })
      }
      if(uId){
          q.where('user_id', uId)
      }
      let event = q.paginate(data.event, data.eventSize);
      return event;
    }

    topupCount(){
      return Transection.query().pojo<{ total: number }>().count('id as total').first()
     }


    public async getAdRateswithLimit(data :any) {
      let str  =data.str;
      let q = AdRate.query().orderBy(data.colName, data.order)

      if(str){
          q.where((query) => {
            query.whereRaw("ad_type  LIKE '%" + str + "%'")
            query.orWhereRaw("activity_type  LIKE '%" + str + "%'")
          })
      }
      let event = q.paginate(data.event, data.eventSize);
      return event;
    }

    rateCount(){
      return AdRate.query().pojo<{ total: number }>().count('id as total').first()
     }

    public async deleteRate(key:string , value :string) {
      return AdRate.query().where(key, value).delete();
    }

    public async editRate(key , value , data) {
      return AdRate.query().where(key, value).update(data);
    }

    public async createRate(data) {
      return AdRate.create(data);
    }




}
