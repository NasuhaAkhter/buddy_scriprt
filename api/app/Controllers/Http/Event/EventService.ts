import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EventQuery from './EventQuery';
import CustomHelpers from 'App/Helpers/CustomHelpers';
// import { cuid } from '@ioc:Adonis/Core/Helpers'
// import Application from '@ioc:Adonis/Core/Application'
import moment from 'moment'
import Event from '@ioc:Adonis/Core/Event'

export default class EventService {
    private eventQuery : EventQuery
    private customHelpers : CustomHelpers
    constructor(){
      this.eventQuery = new EventQuery
      this.customHelpers = new CustomHelpers
    }
    public async getEventByLimit(ctx : HttpContextContract){
      const limit = ctx.request.all().limit
      const user = await this.eventQuery.getUserByLimit(limit)
      return user
   }

   public async createEvent(ctx){ 
    let eventData=ctx.request.all()
    let start_date_time= moment(eventData.start_time).format('YYYY-MM-DD HH:mm:ss');
    let end_date_time= moment(eventData.end_time).format('YYYY-MM-DD HH:mm:ss');
    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    if (now >= start_date_time) {
      return ctx.response.status(404).send({msg: "Please give a valid start time"})
    }
    if ((now >= end_date_time) || (start_date_time >= end_date_time)) {
      return ctx.response.status(404).send({msg: "Please give a valid end time"})
    }
    eventData.end_time = await moment(eventData.end_time).format();
    eventData.start_time = await moment(eventData.start_time).format();
    let slug = eventData.event_name
    slug=slug.replace(/[^\w/ /\d]/g, '');
    slug=slug.replace(/ /g,"_");
        let totalUsers : any[] = await this.eventQuery.searchSlug(slug)
        let numberOfUsers : number = totalUsers[0].total
        let newCount = numberOfUsers > 0 ? ++numberOfUsers : ''
        slug = newCount > 0 ? `${slug}_${newCount}` : slug
        eventData.slug = slug
    let storeData = await this.eventQuery.createEvent(eventData) 
    await this.eventQuery.createGoingInterested(storeData.id,storeData.user_id,'going')
    return storeData
     
  }
 
  public async editEvent(ctx){
    let eventData=ctx.request.all()

    let start_date_time= moment(eventData.start_time).format('YYYY-MM-DD HH:mm:ss');
    let end_date_time= moment(eventData.end_time).format('YYYY-MM-DD HH:mm:ss');
    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    if (now >= start_date_time) {
      return ctx.response.status(404).send({msg: "Please give a valid start time"})
    }
    if ((now >= end_date_time) || (start_date_time >= end_date_time)) {
      return ctx.response.status(404).send({msg: "Please give a valid end time"})
    }
    
    let slug = eventData.event_name   
    slug=slug.replace(/[^\w/ /\d]/g, '');
    slug=slug.replace(/ /g,"_");

    // slug=slug.replace(/[&\/\\#,+@^()$~%.'":*?<>{}]/g, '');
    console.log("slug", slug)

        let totalUsers : any[] = await this.eventQuery.searchSlug(slug)
        let numberOfUsers : number = totalUsers[0].total
        let newCount = numberOfUsers > 0 ? ++numberOfUsers : ''
        slug = newCount > 0 ? `${slug}_${newCount}` : slug
        eventData.slug = slug
        eventData.end_time = await moment(eventData.end_time).format();
        eventData.start_time = await moment(eventData.start_time).format();
        return await this.eventQuery.editEvent(eventData,eventData.id)
  }
  
  async  deleteEvent(ctx){
    let data = ctx.request.all()
    if(data.user_id != ctx.auth.user?.id) return
    return this.eventQuery.deleteEvent(data.event_id)
  }

  public async getAllEvent(ctx : HttpContextContract){
    const data = ctx.request.all()
    const limit = data.limit
    const page = data.page
    let userId:any = ctx.auth.user?.id
    if(data.tab == 'interested'){
      return this.eventQuery.getInterestedEvent(limit,page,userId)
    }
    else if(data.tab == 'going'){
      return this.eventQuery.getGoingEvent(limit,page,userId)
    }
    else if(data.tab == 'discover'){
      return this.eventQuery.getDiscoverEvent(limit,page,userId)
    }
    else{
      return this.eventQuery.getAllEvent(limit,page,userId)
    }
  }

  public async getEventDetails(ctx : HttpContextContract){
    const data = ctx.request.all()
      if(!data.event || !data.tab) return
      let userId:any= ctx.auth.user?.id
      let basicOverView = await this.eventQuery.getUserBasicOverView(data.event)
      // if(!basicOverView) return "Event is over now" 
      if(!basicOverView) return ctx.response.status(404).send({msg: "Event is over now!"})
       let isGoing = await this.eventQuery.getIsGoing(basicOverView.id,userId)
      
      // formate the data
      // basicOverView.work_data = basicOverView.work_data ? JSON.parse(basicOverView.work_data) : []
      // basicOverView.skill_data = basicOverView.skill_data ? JSON.parse(basicOverView.skill_data) : []
      // basicOverView.education_data = basicOverView.education_data ? JSON.parse(basicOverView.education_data) : []
      // console.log('tab is ', data.tab)
      if(data.tab == 'feed'){
        //  let privacy = ['Public']
        //  if(userId == basicOverView.id){ // add only as well
        //    privacy.push('Only Me')
        //  }
         // later check if this user is a friend with logged in user..
         let feedData = await this.eventQuery.getProfileFeed(basicOverView.id, ctx.request.all().more , ctx.auth.user?.id )
         if(feedData.length){
           feedData = await this.customHelpers.feedResponse(feedData,null, ctx.auth.user?.id)
         }

         return {
            isGoing,
            basicOverView,
            feedData
         }
        // console.log('ok')
      }
      if(data.tab == 'about'){
        return {
          isGoing,
          basicOverView,
        }
      }
      if(data.tab == 'photos'){
         let photos = await this.eventQuery.getUserUploadedFile('image', basicOverView.id)
         photos = this.customHelpers.formateFiles(photos)
         return {
          isGoing,
          basicOverView,
          photos
         }
      }
      if(data.tab == 'videos'){
         let videos = await this.eventQuery.getUserUploadedFile('video', basicOverView.id)
         videos = this.customHelpers.formateFiles(videos)
         return {
          isGoing,
          basicOverView,
          videos
         }
      }
      if(data.tab == 'invite'){
        let allFriends = await this.eventQuery.getAllMembers(userId,null,basicOverView.id)
        let allInvitedMembers = await this.eventQuery.getAllInvitedMembers(basicOverView.id,0)
        return {
          isGoing,
          basicOverView,
          allFriends,
          allInvitedMembers
         }
      }
      return 'nothing matched'
    }

    async uploadEventPic(ctx : HttpContextContract){
      let data = ctx.request.all()
      const image = ctx.request.file('file')
      if(!image) return
      // const fileName = `${cuid()}.${image.extname}`
      // await image.move(Application.publicPath('uploads'),{
      //   name: fileName,
      // })
      // let pic = `http://localhost:3333/uploads/${fileName}`
      let images:any
       images = await this.customHelpers.uploadImages2(ctx)

      let obj = {
        [data.uploadType] : images,
      }
      console.log('obj',obj)
      await this.eventQuery.saveUserInfo(obj, data.page_id)
      let isPic = data.uploadType == 'profile_pic' ? true : false
      return {
        picture : images,
        isProfile: isPic
      }
    }

    async addMember(ctx : HttpContextContract){
      let data = ctx.request.all()
      let user:any = ctx.auth.user
      data.status='invited'
      data.from_user_id = user?.id
      const event = await this.eventQuery.getEventEditDetails(data.event_id)
      if(!event) return ctx.response.status(404).send({msg: "Event not found !"})
      let event_invite = await this.eventQuery.addMember(data)
      let res = await this.eventQuery.eventinvitesMember(event_invite.id)
      // let allInvitedMembers = await this.eventQuery.getAllInvitedMembers(data.event_id,0)
      await Event.emit('new:member', { 
        user_id :data.user_id,
        from_id: user?.id,
        noti_type: 'event_invitation',
        noti_meta: {
          slug:event?.slug,
          action_text: 'invited you to '+ `${event?.user?.first_name}`+ ' '+`${event?.user?.last_name}` + `'s event `+`${event?.event_name}`+ '.'
        },
      })
      return {
        res
      }
    }

    async getAllInvitedMembers(ctx : HttpContextContract){
      let data = ctx.request.all()
      // let userId:any = ctx.auth.user?.id
      let allInvitedMembers = await this.eventQuery.getAllInvitedMembers(data.event_id,data.lastId)
      return {
        allInvitedMembers
      }
    }
    async getAllMembers(ctx : HttpContextContract){
      let data = ctx.request.all()
      let userId:any = ctx.auth.user?.id
      let allFriends = await this.eventQuery.getAllMembers(userId,data.lastId,data.event_id)
      return {
        allFriends
      }
    }

    async goingInterested(ctx : HttpContextContract){
      let data = ctx.request.all()
      let userId:any = ctx.auth.user?.id
      const event = await this.eventQuery.getEventEditDetails(data.event_id)
      if(!event) return ctx.response.status(404).send({msg: "Event not found !"})
   
      let res=await this.eventQuery.isInvited(data.event_id,data.user_id)
      if(res==null){
         await this.eventQuery.createGoingInterested(data.event_id,data.user_id,data.status)
      }else{
        if( res.status == data.status){
          if(res.from_user_id == null){
            await this.eventQuery.deleteInvite(data.event_id,data.user_id)
          }else{
            await this.eventQuery.goingInterested(data.event_id,data.user_id,'invited')
          }
        }
        await this.eventQuery.goingInterested(data.event_id,data.user_id,data.status)
      }
      let isGoing = await this.eventQuery.getIsGoing(data.event_id,userId) 
      if(event.user_id != data.user_id &&  (res==null || res.status != data.status)){
        let preposition = 'to'
        if(data.status == 'interested'){
          preposition = 'in'
        }
        await Event.emit('new:member', { 
          user_id :event.user_id,
          from_id: data.user_id,
          noti_type: 'event_invitation',
          noti_meta: {
            slug:event?.slug,
            action_text: 'is '+`${data.status}`+` ${preposition} `+`${event?.event_name}`+ '.'
          },
        })
      }
     
      if( isGoing?.from_user_id && isGoing?.from_user_id != event.user_id ){
        await Event.emit('new:member', { 
          user_id :isGoing?.from_user_id,
          from_id: data.user_id,
          noti_type: 'event_invitation',
          noti_meta: {
            slug:event?.slug,
            action_text: 'accepted your invitation to '+`${event?.event_name}`+ '.'
          },
        })
      }
      return {
        isGoing
      }
    }

    public async getEventEditDetails(ctx : HttpContextContract){
      const data = ctx.request.all()
      return this.eventQuery.getEventEditDetails(data.event_id)
   }
   
    public async searchInviteMember(ctx : HttpContextContract){
      let data = ctx.request.all()
      data.str = await data.str.replace(/\s/g, "");
      if(data.str == '') return 'nothing matched'
      let userId:any = ctx.auth.user?.id
      return this.eventQuery.searchInviteMember(userId,data.str, data.event_id)
   }

    public async accecptInvite(ctx : HttpContextContract){
      let data = ctx.request.all()
      let userId:any = ctx.auth.user?.id
      return this.eventQuery.accecptInvite(userId,data.event_id)
   }
    public async cancelInvite(ctx : HttpContextContract){
      let data = ctx.request.all()
      let userId:any = ctx.auth.user?.id
      return this.eventQuery.cancelInvite(userId,data.event_id)
   }
  
};
