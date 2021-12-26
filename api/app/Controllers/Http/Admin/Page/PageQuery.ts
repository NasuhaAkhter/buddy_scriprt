
import Group from '../../../../Models/Group';
import Page from '../../../../Models/Page'
import User from '../../../../Models/User'
import Event from '../../../../Models/Event'
import Feed from '../../../../Models/Feed'
import StaticPage from 'App/Models/StaticPage';

export default class PageQuery{

    public async getAllPage(data :any) {
      let str  =data.str;
      let q = Page.query().orderBy(data.colName, data.order)
              .select('id','user_id','page_name', 'category_name', 'total_page_likes', 'created_at')
              .withCount('feed')
      if(str){
          q.where((query) => {
            query.whereRaw("page_name  LIKE '%" + str + "%'")
            query.orWhereRaw("category_name  LIKE '%" + str + "%'")
            query.orWhereRaw("created_at  LIKE '%" + str + "%'")
          })
      }
      let page = q.paginate(data.page, data.pageSize);
      return page;
    }

    pageCount(){
      return Page.query().pojo<{ total: number }>().count('id as total').first()
    }

    public async deletePage(key:string , value :string) {
      return Page.query().where(key, value).delete();
    }

    public async getSinglePage(key:string , value :string) {
      return Page.query().where(key, value).first();
    }

    public async test() {
      return Page.query().pojo<{ total: number }>().count('id as total').first()
    }


    //All-count-functions
    public async allCountations(ctx) {
      let user =await User.query().pojo<{ total: number }>().where('userType',0).count('id as total').first()
      let onlineUser =await User.query().pojo<{ total: number }>().where('is_online', 'online').where('userType',0).count('id as total').first()
      let page =await Page.query().pojo<{ total: number }>().count('id as total').first()
      let group =await Group.query().pojo<{ total: number }>().count('id as total').first()
      let event =await Event.query().pojo<{ total: number }>().count('id as total').first()
      let feed =await Feed.query().pojo<{ total: number }>().whereNull('page_id').whereNull('group_id').whereNull('event_id').count('id as total').first()
      let pageFeed =await Feed.query().pojo<{ total: number }>().whereNotNull('page_id').count('id as total').first()
      let groupFeed =await Feed.query().pojo<{ total: number }>().whereNotNull('group_id').count('id as total').first()

      return ctx.response.send({
        user,
        onlineUser,
        page,
        group,
        event,
        feed,
        pageFeed,
        groupFeed,
      })
    }

   public async staticPages(){
     return StaticPage.query().orderBy('id', 'desc');
   }

   public async editStaticPages(ctx){
     let data = ctx.request.all()
     return StaticPage.query().where('id', data.id).update({'description': data.description})
   }


}
