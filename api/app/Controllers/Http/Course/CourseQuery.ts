import Course from 'App/Models/Course'
import User from 'App/Models/User'
import NrcCourse from 'App/Models/NrcCourse'
import PreLicensingCourse from 'App/Models/PreLicensingCourse'
import CourseSubscriber from 'App/Models/CourseSubscriber'
export default class CourseQuery{
   public async getCourseByType(type:string,limit :number)  {
      return Course.query()

      .where('activity_type', type)
      .preload('user')
      .withCount('subscribers')
      .orderBy('order_id', 'desc')
      .limit(limit)
       
   }
   public async getCourseByTypeCount(type:string)  {
      return Course.query().where('activity_type', type).count('* as total')
   }

   async getCourseDetailsById (id:number,user_id:number){
      return Course.query()
            .where('id', id)
            .preload('user')
            .preload('isSubscriber', (builder) => {
                builder.where('user_id', user_id)
            })
            .first()
   }
   async getNrcCourse (limit:number){
      return NrcCourse.query().limit(limit).orderBy('order_id','desc');
   }
   async getPreLicensingCourse (limit:number){
      return PreLicensingCourse.query().limit(limit).orderBy('order_id','desc');
   }
   async getNrcCourseCount (){
      return NrcCourse.query().count('* as total')
   }
   async getPreLicensingCourseCount (){
      return PreLicensingCourse.query().count('* as total')
   }
   async increaseCourseView (id:number){
      return Course.query().where('id', id).increment('views', 1)
   }
   async createCourseSubscriber (data:any){
      return CourseSubscriber.create(data)
      
   }
   async updateCourseSubscribers (id:number,data:any){

      return CourseSubscriber.query()
          .where('id', id)
          .update(data)
   }
   async updateUserCourseMembership (user_id:number,expired_at:any){

      
      return  User.query().where('id',user_id).update({
         course_status:'Member',
         member_expired_at:expired_at
       })
   }
  
}
