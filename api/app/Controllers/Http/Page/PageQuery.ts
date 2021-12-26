import User from '../../../Models/User'
import Feed from '../../../Models/Feed'
import Category from '../../../Models/Category'
import Page from '../../../Models/Page'
import Pagefollower from '../../../Models/Pagefollower'
import Database from '@ioc:Adonis/Lucid/Database'
import StaticPage from 'App/Models/StaticPage'
export default class PageQuery{
    public async getUserByLimit(limit : number) : Promise<User[]> {
       const user = User.query().limit(limit)
       return user
    }
    public async getCategory(){
       return await Category.all()
    }
    public async getAllPage(limit,page,uid) {
      return await Page.query().where('user_id',uid).preload('pageFollowers').orderBy('id','desc').paginate(page, limit)
    }
    public async getFollowedPage(limit,page,uid) {
      return await Page.query().preload('pageFollowers')
                        .where('user_id', '!=',uid)
                        .whereHas('pageFollowers', (postsQuery) => {
                           postsQuery.where('user_id', uid)
                        })
                       .orderBy('id','desc').paginate(page, limit)
    }
    public async getDiscoverPage(limit,page,uid) {
      return await Page.query().preload('pageFollowers')
      .whereDoesntHave('pageFollowers', (postsQuery) => {
         postsQuery.where('user_id', uid)
      })
      .orderBy('id','desc').paginate(page, limit)
    }
   //  public async getPageDetailsMedia(slug,tab) {
   //     return await Page.query().where('slug',slug).first()
   //  }
   //  public async getPageDetailsAbout(slug,tab) {
   //     return await Page.query().where('slug',slug).first()
   //  }
   //  public async getPageDetailsFeed(slug,tab) {
   //     return await Page.query().where('slug',slug).first()
   //  }


    public async addPage(pageData){
      return await Page.create(pageData)
   }
   public async editPage(pageData,pid){
      await Page.query().where('id',pid).update(pageData)
      return Page.query().where('id',pid).first()
   }
   searchSlug(page_name){
      return Database.from('pages').where('slug','like', `${page_name}%`).count('* as total')
   }

   // new
   public async getUserBasicOverView(slug : string) : Promise<any|null> {
      return await Page.query().where('slug',slug).preload('pageFollowers').first()
   }
   public async getProfileFeed(uid : any, more,userId){
      let q = Feed.query().where('page_id', uid).orderBy('id', 'desc')

          .preload('user')
          .where((builder) => {
            builder.whereDoesntHave('blockedUser', (qq) => {
              qq.where('user_id', userId)
            })
            builder.whereDoesntHave('userBlocked',(q)=>{
              q.where('blocked_user_id', userId )
             })
          })
          .preload('page')
          .preload('event')
          .preload('group')
          .preload('savedPosts', (b) => {
               b.where('user_id', userId)
           })
          .preload('like', (b) => {
              b.where('user_id', uid)
          })
        if(more > 0){
            q.where('id', '<', more)
        }
        return q.limit(15)
    }

    async getUserUploadedFile(fileType, uid){
      return Feed.query().where('page_id', uid).where('feed_privacy', '!=', 'ONLY ME').where('file_type', fileType).select('id','files')
   }

   async saveUserInfo(userColumnsObj : object, uid){
      return Page.query().where('id', uid).update(userColumnsObj)
   }
      public async followPage(pageFollowers : object,pid) : Promise<any|null> {
         await Pagefollower.firstOrCreate(pageFollowers)
         await Page.query().where('id',pid).increment('total_page_likes',1)
         return await Page.query().where('id',pid).preload('pageFollowers').first()
      }
   async unfollowPage(pid,uid){
      await Pagefollower.query().where('page_id',pid).where('user_id',uid).delete()
      await Page.query().where('id',pid).decrement('total_page_likes',1)
      return await Page.query().where('id',pid).preload('pageFollowers').first()

   }

   public async getPageEditDetails(page_id) {
      return await Page.query().where('id',page_id).first()
   }
   deletePage(key, value){
      return Page.query().where(key, value).delete();
   }

   getSingleStaticPage(ctx){
     return StaticPage.query().where('slug', ctx.params.slug).first();
   }


}
