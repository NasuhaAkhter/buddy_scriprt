import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PageService from './PageService';
import PageValidator from './PageValidator';
export default class PageController {
  private pageService : PageService
  private pageValidator : PageValidator
  constructor () {
    this.pageService =  new PageService()
    this.pageValidator =  new PageValidator()
  }

  async getAllPage(ctx: HttpContextContract){
      return this.pageService.getAllPage(ctx)
  }



  async test(){
      return this.pageService.test()
  }

  async getSinglePage(ctx: HttpContextContract){
    return this.pageService.getSinglePage(ctx)
 }

  async deletePage(ctx: HttpContextContract){
    return this.pageService.deletePage(ctx)
 }

 //All-count-functions
 async allCountations(ctx: HttpContextContract){
  return this.pageService.allCountations(ctx)
 }
 //All-static-functions
 async staticPages(){
  return this.pageService.staticPages()
 }

 async editStaticPages(ctx: HttpContextContract){
  return ctx.request.all();
  try {
    let vData = await this.pageValidator.validateEditPageSchema(ctx)
    ctx.request.all().id = vData.id
    ctx.request.all().description = vData.description
    return this.pageService.editStaticPages(ctx)
  } catch (error) {
     return ctx.response.status(422).send(error.messages)
  }

 }



}
