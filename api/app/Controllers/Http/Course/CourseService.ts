import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CourseQuery from './CourseQuery';
const axios = require('axios');
import CustomHelpers from 'App/Helpers/CustomHelpers';
const moment = require('moment')

export default class CourseService {
    private courseQuery : CourseQuery
    
    private customHelpers : CustomHelpers
    constructor(){
      this.courseQuery = new CourseQuery
      this.customHelpers = new CustomHelpers

    }
    public async getAllCourseType(ctx : HttpContextContract){

      let tranings = await this.courseQuery.getCourseByType('Traning',6)
      let webinars = await this.courseQuery.getCourseByType('Webinar',6)

      
      if (tranings.length > 0) {
          for (let d of tranings) {
            let details = JSON.parse(d.data);
            details.totalContents = details.contents.length
            details.contents = [];

            d.data = details;
          }
      }
      if (webinars.length > 0) {
          for (let d of webinars) {
            let details = JSON.parse(d.data);
            details.totalContents = details.contents.length
            details.contents = [];
            details.course_price  = 12.99;
            d.data = details;
          }
      }

      let nrc_courses = await this.courseQuery.getNrcCourse(6)
      let pre_licensing = await this.courseQuery.getPreLicensingCourse(6)
  


      return ctx.response.status(200).json({
          courses: tranings,
          webnairs: webinars,
          nrc_courses: nrc_courses,
          pre_licensing: pre_licensing,
      })
    }
    public async getAllCourseTypeCount(ctx : HttpContextContract){

      let tranings = await this.courseQuery.getCourseByTypeCount('Traning')
      let webinars = await this.courseQuery.getCourseByTypeCount('Webinar')
      let nrc_courses = await this.courseQuery.getNrcCourseCount()
      let pre_licensing = await this.courseQuery.getPreLicensingCourseCount()
  


      return ctx.response.status(200).json({
          coursesCount: tranings,
          webnairsCount: webinars,
          nrc_coursesCount: nrc_courses,
          pre_licensingCount: pre_licensing,
      })
    }
    public async getCourseByType(ctx : HttpContextContract){
      const type = ctx.params.type
      const limit = ctx.request.all().limit? ctx.request.all().limit : 6
      if(type == 'Webinar' || type == 'Traning'){

        let courses = await this.courseQuery.getCourseByType(type,limit)
        if(!courses.length) return courses;
        for(let d of courses ){
  
          let details = JSON.parse(d.data);
          details.totalContents = details.contents.length
          
          details.contents = [];
          if(d.activity_type == 'Webinar') details.course_price  = 12.99;
          d.data = details;
        }
        return courses
      }
      
      else if(type == 'NrcCourse'){
        let courses = await this.courseQuery.getNrcCourse(limit)
        return courses
      }
      else if(type == 'PreLicensingCourse'){
        let courses = await this.courseQuery.getPreLicensingCourse(limit)
        return courses
      }
      else {
        return [];
      }
      
    }
    async getCourseDetailsById (ctx : HttpContextContract){
      let user = {
        id:0
      }
      try {
        user =  await ctx.auth.use('web').authenticate();
      } catch (error) {
        console.log("Erorro",error)
      }
      const id = ctx.params.id
      // return ctx.params.id
      let course = await this.courseQuery.getCourseDetailsById(id,user.id)
       this.courseQuery.increaseCourseView(id)
      
      if(!course) return course;
      let isSubscription = false

      if (course.isSubscriber) {
        isSubscription = true;
        let isSubscriber = course.isSubscriber;
        let date_now = moment().format("YYYY-MM-DD")
        let course_expired_at = moment(isSubscriber.expired_at).format("YYYY-MM-DD")
        if(course_expired_at < date_now){
          isSubscription = false;
            console.log("Course Expired!")
            this.courseQuery.updateCourseSubscribers(isSubscriber.id,{isActive:0})
            // data.isSubscriber = null
            // isSubscriber = null
        }
      }
      let details = JSON.parse(course.data);
      details.totalContents = details.contents.length
      details.isSubscription = isSubscription;
      details.contents = [];
      course.data = details;


      return course;
    }
    async getCourseDetailsByAppId (ctx : HttpContextContract){
      let user:any = {
        id:0
      }
      try {
        user =  await ctx.auth.use('api').authenticate();
      } catch (error) {
        console.log("Erorro",error)
      }
      const id = ctx.params.id
      // return ctx.params.id
      let course = await this.courseQuery.getCourseDetailsById(id,user.id)
       this.courseQuery.increaseCourseView(id)
      
      if(!course) return course;
      let isSubscription = false

      if (course.isSubscriber) {
        isSubscription = true;
        let isSubscriber = course.isSubscriber;
        let date_now = moment().format("YYYY-MM-DD")
        let course_expired_at = moment(isSubscriber.expired_at).format("YYYY-MM-DD")
        if(course_expired_at < date_now){
          isSubscription = false;
            console.log("Course Expired!")
            this.courseQuery.updateCourseSubscribers(isSubscriber.id,{isActive:0})
            // data.isSubscriber = null
            // isSubscriber = null
        }
      }
      if(user && user.id !=0 && user.course_status == 'Member' &&  course.activity_type == 'Webinar') isSubscription = true
      let details = JSON.parse(course.data);
      details.totalContents = details.contents.length
      details.isSubscription = isSubscription;
      if(isSubscription == false) details.contents = [];
      else {
        if(course.activity_type == 'Webinar'){

            for(let d of details.contents){
              d.title = course.activity_text
            }
        }
      }
      if(course.activity_type == 'Webinar') details.course_price  = 12.99;
      course.data = details;


      return course;
    }
    async getCourseContentsById (ctx : HttpContextContract){
      let user = {
        id:0,
        course_status:'General'
      }
      try {
        user =  await ctx.auth.use('web').authenticate();
      } catch (error) {
        // console.log("Erorro",error)
      }
      const id = ctx.params.id
      // return ctx.params.id
      let course = await this.courseQuery.getCourseDetailsById(id,user.id)
       this.courseQuery.increaseCourseView(id)
      
      if(!course) return course;
      let isSubscription = false


    if (user.course_status != 'Member' && course.subscribers == null) {
        return ctx.response.status(401).json({
            msg: "You are not subscribe to this webinar"
        })
    }

      if (course.isSubscriber) {
        isSubscription = true;
        let isSubscriber = course.isSubscriber;
        let date_now = moment().format("YYYY-MM-DD")
        let course_expired_at = moment(isSubscriber.expired_at).format("YYYY-MM-DD")
        if(course_expired_at < date_now){
          isSubscription = false;
            console.log("Course Expired!")
            this.courseQuery.updateCourseSubscribers(isSubscriber.id,{isActive:0})
            // data.isSubscriber = null
            // isSubscriber = null
        }
      }
      let details = JSON.parse(course.data);
      details.totalContents = details.contents.length
      details.isSubscription = isSubscription;
      
      course.data = details;


      return course;
    }

    async coursePaymentWeb (ctx : HttpContextContract){
      console.log('coursePaymentWeb',ctx.request.all())
    }
    async coursePaymentApp (ctx : HttpContextContract){
      let user:any = ctx.auth.user
      
      let data = ctx.request.all()
      if (user.id != data.user_id) {
        return ctx.response.status(401).json({
            msg: 'You are not authorized!'
        })
      }
      if (!data.course_id || !data.price || !data.paymentType || !data.transaction_id) {
          return ctx.response.status(401).json({
              msg: 'Invalid request!'
          })
      }

      if(data.paymentType == 'Apple Pay'){
        let checkReceipt = await this.applePayValidation(data.receipt)
        if(checkReceipt.success == false){
            return ctx.response.status(401).json({
                message: 'Receipt validation failed!',
                data:checkReceipt
            }) 
        }
      }
      let course_data:any =  await this.courseQuery.getCourseDetailsById(data.course_id,user.id);

      if(data.type == 1){
        let obb:any = {
            user_id:user.id,
            course_id:data.course_id,
            isActive:1
        };
        if(data.couponStatus){  
            obb.coupon = data.couponItem.name
        }
        let ad_months = course_data.activity_type == 'Webinar'? 1 : 6
        var futureMonth =  moment().add( ad_months, 'M');
        obb.expired_at =  moment(futureMonth).format("YYYY-MM-DD");
        await this.courseQuery.createCourseSubscriber(obb);
      }

      else{
        var futureMonth =  moment().add( 1, 'Y');
        var expired_at =  moment(futureMonth).format("YYYY-MM-DD");
        await this.courseQuery.updateUserCourseMembership(user.id,expired_at);
    }
      


      

      let newTransactionData = {
        user_id: user.id,
        amount: (data.price) * -1,
        reason: 'Course',
        ad_id: data.course_id,
        paymentType: data.paymentType,
        payment_id: data.transaction_id,
      }
      await this.customHelpers.createUserTransaction(newTransactionData);

      // await Notification.sendCoursePaymentNotification(user, 'Training Course has been purchased successfully!',course_data)

      let course:any =  await this.courseQuery.getCourseDetailsById(data.course_id,user.id);
      // if(course.isSubscribe){
      //     let dateNow = new Date();
      //     let created_date = new Date(course.subscriber.created_at);
      //     created_date.setMonth(created_date.getMonth()+6);
      //     // var today = new Date(expire_date);
      //     var dd = String(created_date.getDate()).padStart(2, '0');
      //     var mm = String(created_date.getMonth() + 1).padStart(2, '0'); //January is 0!
      //     var yyyy = created_date.getFullYear();

      //     var expire_fdate = yyyy + '-' + mm + '-' + dd;
      //     course.validity = `Expire in ${expire_fdate} `; 
      // }

      return ctx.response.status(200).json({
          message: 'Course has been purchased successfully!',
          success:true,
          course: course

      })
      

    }

    async applePayValidation(recept){
      let data =  await this.productionApplePayValidationUrl(recept)
      console.log('applePayValidation')
      console.log(data)

      if(data.status ==  21007){
          console.log('Inthe Sand box')
          return await this.sandBoxApplePayValidationUrl(recept)
      }
      else return data;
    }
    async productionApplePayValidationUrl(recept){
      const url = 'https://buy.itunes.apple.com/verifyReceipt';
      return await axios.post(url, {
          'receipt-data': recept,
      })
      .then(function (response) {
          return  {
              success:true,
              data:response.data
          }
      })
      .catch(function (error) {
          return {
              success:false,
              data:error
          }
      });
    }
    async sandBoxApplePayValidationUrl(recept){
      const url = 'https://sandbox.itunes.apple.com/verifyReceipt';
     
      return await axios.post(url, {
          'receipt-data': recept,
      })
      .then(function (response) {
          // res = JSON.parse(JSON.stringify(response))
        return  {
            success:true,
            from:'sandBox',
            data:response.data
        }
      })
      .catch(function (error) {
      // console.log(error);
        return {
            success:false,
            from:'sandBox',
            data:error
        }
      });
  }


};
