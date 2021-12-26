import User from 'App/Models/User'
import Group from 'App/Models/Group'
import Page from 'App/Models/Page'
import Event from 'App/Models/Event'
import Groupmember from 'App/Models/Groupmember'
import Feed from 'App/Models/Feed'
import Category from 'App/Models/Category'
import Database from '@ioc:Adonis/Lucid/Database'
 
export default class GroupQuery{
    public async getUserByLimit(limit : number) : Promise<User[]> {
       const user = User.query().limit(limit)
       return user
    }
    public async storeGroupQuery( data:object)  {
       const create_group = await Group.create(data)
       return create_group
    }
    public async storeGroupMemberQuery(group_id, userId){
        return await Groupmember.create({
            group_id:group_id,
            user_id:userId,
            is_admin:"super admin"
        })
    }
    public async updateGroup(data){
        return await Group.query().where('id', data.id).update(data)
    }
    public async checkMemberQuery(group_id:number, user_id:number){
         const countedArray =  Database.from('groupmembers').where('group_id', group_id).where('user_id', user_id)
         .count('*', 'total').first()
        return countedArray
    }
    public async getGroupQuery(group_id:number){
        return await Group.query().where('id', group_id).first()
    }
    public async incrementGroupMember(data:any){
        return await Group.query().where('id', data.id).increment('total_members', 1)
    }
    public async addGroupMember(data:object){
        return Groupmember.create(data)
    }
    async saveGroupInfo(userColumnsObj : object, group_id:number){
        return Group.query().where('id', group_id).update(userColumnsObj)
    }
    async leaveGroup(group_id:number, userId:number){
      return Groupmember.query().where('group_id', group_id).where('user_id', userId).delete()
    }
    async updateGroupMember(group_id:number,string){
        return Group.query().where('id', group_id).increment('total_members', string)
    }
    async joinGroup(group_id:number, userId:number){
       return await Groupmember.firstOrCreate({group_id:group_id, user_id: userId}, { is_admin : "user"})
     }
    async removeGroup(group_id:number, user_id:number){
    return Groupmember.query().where('group_id', group_id).where('user_id', user_id).delete()
    }
    async deleteGroup(group_id:number){
    return Group.query().where('id', group_id).delete()
    }
    async makeAdmin(group_id:number, user_id:number){
        return Groupmember.query().where('group_id', group_id)
        .where('user_id', user_id).update({
            'is_admin' :"admin"
        })
    }
    async removeAdminRole(group_id:number, user_id:number){
        return Groupmember.query().where('group_id', group_id).where('user_id', user_id).update({
            'is_admin' :"user"
        })
    }
    async checkAdminQuery(group_id:number, user_id:number){
        const counted_array =  Database.from('groupmembers').where('group_id', group_id).where('user_id', user_id).where('is_admin', "super admin")
        .count('*', 'total').first()
        return counted_array
    }
    public async feedSearch(str:string, more, user_id:number){
       
        let q =  Feed.query()
        .preload('page')
        .preload('group')
        .preload('event')
        .preload('savedPosts', (b) => {
            b.where('user_id', user_id)
        })  
        .where((builder) => {
            builder.whereDoesntHave('blockedUser', (qq) => {
              qq.where('user_id', user_id)
            })
            builder.whereDoesntHave('userBlocked',(q)=>{
              q.where('blocked_user_id', user_id )
             })
          })
        .where((query) => {
            query
            .where('feed_privacy', 'PUBLIC')
            .orWhere('user_id', user_id)
          })
        .where((builder) => {
            builder.where((query) => {
              query
                 .whereNull('group_id')
             })
            builder.orWhere((query) => {
              query
                .whereNotNull('group_id')
                .whereHas('group', (groupQuery) => {
                  groupQuery.where('group_privacy', 'PUBLIC') 
                  groupQuery.orWhere((memberQuery) => {
                    memberQuery.whereHas('is_member', (memberQuery2) => {
                      memberQuery2.where('user_id', user_id) 
                    })
                  })
                })
            })
        })        
        .whereRaw("feed_txt  LIKE '%" + str + "%'")
       
        .orderBy('id', 'desc')
        .preload('user')
        .preload('like', (b) => {
            b.where('user_id', user_id)
        })  
        if(more > 0){
            q.where('id', '<', more)
        }
       return q.limit(15)
        
    }
    public async groupSearch(str:string, user_id:number){
        let searchTxt = `${str}*` 

        return  Group.query().preload('is_member')  
        .preload('is_member', (b) => {
            b.where('user_id', user_id)
        })
        .whereRaw("MATCH (group_name) AGAINST (? IN BOOLEAN MODE)",[searchTxt])
        // .whereRaw("group_name  LIKE '%" + str + "%'")
        .orderBy('id', 'desc')
        .limit(15)
    }
    public async pageSearch(str:string, user_id:number){ 
        let searchTxt = `${str}*` 
         return Page.query()
         .preload('isFollowing', (query) =>
            query.where('user_id', user_id)
         ).where('is_published', 1)
         .whereRaw("MATCH (page_name) AGAINST (? IN BOOLEAN MODE)",[searchTxt])
        //  .whereRaw("page_name  LIKE '%" + str + "%'")
         .orderBy('id', 'desc')
        .limit(15)
    }
    public async peopleSearch(str:string, user_id:number){
        let searchTxt = `${str}*` 

        return User.query()
        .preload('friend', (b) => {
            b.where('friend_id', user_id)
        })
        // .preload('blockedUser', (b) => {
        //     b.where('user_id', user_id)
        // })
        // .preload('userBlocked', (b) => {
        //     b.where('blocked_user_id', user_id)
        // })
        .where((builder) => {
            builder.whereDoesntHave('blockedUser', (qq) => {
              qq.where('user_id', user_id)
            })
            builder.whereDoesntHave('userBlocked',(q)=>{
              q.where('blocked_user_id', user_id )
             })
        })
        .whereRaw("MATCH (first_name, last_name) AGAINST (? IN BOOLEAN MODE)",[searchTxt])

        // .whereRaw("username  LIKE '%" + str + "%'")   
        .orderBy('id', 'desc')
        .limit(15)      
    }
    public async eventSearch(str:string, user_id:number){
        let searchTxt = `${str}*` 
        return Event.query()
        .preload('isFollowing', (query) =>
                query.where('user_id', user_id)
            )
        .whereRaw("MATCH (event_name) AGAINST (? IN BOOLEAN MODE)",[searchTxt])
        .where('is_published', 1)
        .orderBy('id', 'desc')
        .limit(15)
    }
    public async getSearchFriend(str:string , userId, group_id:number){
        let searchTxt = `${str}*` 
        return User.query().whereHas('isfriend', (b)=>{
            b.where('friend_id', userId)
            b.where('status', 'accepted')
        })
        .select('id', 'is_online', 'first_name', 'last_name', 'profile_pic', 'username')
        .whereDoesntHave('isGroupMember',(q)=>{
            q.where('group_id','=', group_id )
        })
        .whereRaw("MATCH (first_name, last_name) AGAINST (? IN BOOLEAN MODE)",[searchTxt])
    }
    public async getFriendNotGroupMember(userId, group_id:number){
        return User.query().whereHas('isfriend', (b)=>{
            b.where('friend_id', userId)
            b.where('status', 'accepted')
        })
        .select('id', 'is_online', 'first_name', 'last_name', 'profile_pic', 'username')
         .whereDoesntHave('isGroupMember',(q)=>{
             q.where('group_id','=', group_id )
         }) 
    }
    public async getCategoryLimit(){
        return await Category.query().orderBy('id', 'desc')
    }
    public async getMyGroupByLimit(limit,page, user_id){
        return await Group.query().whereHas('members'
        , (memberQuery) => {
            memberQuery.where('user_id', user_id).whereIn('is_admin', ["admin","super admin"])
          })
        .orderBy('id', 'desc').paginate(page, limit)
    }
    public async getJoinedGroupByLimit(limit,page, user_id){
        return await Group.query().whereHas('members'
        , (memberQuery) => {
            memberQuery.where('user_id', user_id).where('is_admin', "user")
          })
        .orderBy('id', 'desc').paginate(page, limit)
    }
    public async getDiscoverGroupByLimit(limit,page, user_id){
        return await Group.query().whereDoesntHave('is_member'
        , (memberQuery) => {
            memberQuery.where('user_id', user_id) 
          })
        .orderBy('id', 'desc').paginate(page, limit)
    }
    public async getSingleGroupQuery(slug, userId){
        return await Group.query().where('slug', slug)
        // .preload('members', (memberQuery) => {
        //     memberQuery.preload('user')
        //   })
        .preload('is_member', (memberQuery) => {
            memberQuery.where('user_id', userId)
          })
        .first()
    }
    public async getAdminAndModerators(group_id : number){
        return await Groupmember.query().where('group_id', group_id)
        .whereIn('is_admin', ["admin","super admin"]).preload('user')
    }
    public async getAdminAndModeratorid(group_id : number, userId:number){
        return await Groupmember.query().where('group_id', group_id).where('user_id','!=',userId )
        .whereIn('is_admin', ["admin","super admin"]).select('user_id')
    }
    public async getallAdminAndModeratorid(group_id : number){
        return await Groupmember.query().where('group_id', group_id) 
        .whereIn('is_admin', ["admin","super admin"]).select('user_id')
    }
    public async getAllMembers(group_id : number){
        return await Groupmember.query().where('group_id', group_id)
        .where('is_admin', "user").preload('user')
    }
    async getGroupsUploadedFile(fileType, group_id){
        return Feed.query().where('group_id', group_id)
        .where('feed_privacy', '!=', 'ONLY ME')
        .where('file_type', fileType).select('id','files')
    }
    public async getGroupFeed(uid : number, more, group_id : number, privacy : string[]){
      let q = Feed.query().whereIn('feed_privacy', privacy) 
      .preload('page')
      .preload('group')
      .preload('event')
       .preload('savedPosts', (b) => {
            b.where('user_id', uid)
        })  
        .where((builder) => {
            builder.whereDoesntHave('blockedUser', (qq) => {
                qq.where('user_id', uid)
            })
            builder.whereDoesntHave('userBlocked',(q)=>{
                q.where('blocked_user_id', uid )
                })
            })
      .where('group_id', group_id) 
      .orderBy('id', 'desc')
        .preload('user')
        .preload('page')
        .preload('group')
        .preload('event')
        .preload('like', (b) => {
            b.where('user_id', uid)
        })
        if(more > 0){
            // return more
            q.where('id', '<', more) 
        }
       return q.limit(15)
    }
    public async getSavedPagebyLimit(limit,page, more, user_id){
        let q =  Feed.query()
            .preload('page')
            .preload('group')
            .preload('event')
        .where((query) => {
            query
            .where('feed_privacy', 'PUBLIC') 
            .orWhere('user_id', user_id)
          })   
        .orderBy('id', 'desc').preload('savedPosts')
         .whereHas('savedPosts', (b) => {
            b.where('user_id', user_id)
        }).preload('user')
        .preload('like', (b) => {
            b.where('user_id', user_id)
        })
        if(more > 0){
            q.where('id', '<', more)
        }
       return q.paginate(page, limit)
    }
    public async searchSlug(slug){
        const countedArray =  Database.from('groups').where('slug','like', `%${slug}%`)
         .count('*', 'total').first()
        return countedArray 
    }

}
