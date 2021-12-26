
// import Database from '@ioc:Adonis/Lucid/Database';
import Announcement from 'App/Models/Announcement';

import Ad from '../../../../Models/Add'

export default class AdQuery{

    public async getMyAdByLimit(data){
        let str  =data.str;
        let q = Ad.query().orderBy(data.colName, data.order).preload('user', (query) => {
            query.select('id','first_name','last_name')
          })
        // .select('id','ad_name', 'category_name', 'ad_privacy', 'total_members','created_at')
        if(str){
            q.where((query) => {
              query.whereRaw("name  LIKE '%" + str + "%'")
              query.orWhereRaw("created_at  LIKE '%" + str + "%'")
            }).orWhereHas('user', (builder) => {
                builder.whereRaw("CONCAT( first_name, ' ', last_name )  LIKE '%" + str + "%'")
            })
        }
        let ad = q.paginate(data.page, data.pageSize);
        return ad;
    }

    adCount(){
      return Ad.query().pojo<{ total: number }>().count('id as total').first()
    }


    deleteAd(key, value){
        return Ad.query().where(key, value).delete();
    }

    addAnnouncement(ctx){
        let data =ctx.request.all();
        return Announcement.create(data);
    }

    getActiveAnnouncement(){
        return Announcement.query().where('status', 'ACTIVE').orderBy('id', 'desc').limit(10);
    }

    removeActiveAnnounce(ctx){
      let data = ctx.request.all();
      let id = data.id;
      delete data.id
      return Announcement.query().where('id', id).update(data)
    }

    async getAllAnnounce(data){
      let str  =data.str;
      let q = Announcement.query().orderBy(data.colName, data.order)
      if(str){
          q.where((query) => {
            query.whereRaw("announcement  LIKE '%" + str + "%'")
            query.whereRaw("status  LIKE '%" + str + "%'")
          })
      }
      let announce = q.paginate(data.page, data.pageSize);
      return announce;
    }

    async deleteAnnouncement(ctx){
      let data =ctx.request.all()
      return Announcement.query().where('id', data.id).delete();
    }


}
