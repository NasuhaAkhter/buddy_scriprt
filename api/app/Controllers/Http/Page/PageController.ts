import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PageService from './PageService';
import PageValidator from './PageValidator';

// const imagemin = require('imagemin')
// const imageminJpegtran = require('imagemin-jpegtran')
// const imageminPngquant = require('imagemin-pngquant')
// import { imagemin } from 'imagemin';
// import imagemin from 'imagemin';
// import imageminJpegtran from 'imagemin-jpegtran';
// import imageminPngquant from 'imagemin-pngquant';

export default class PageController {
  private pageService : PageService
  private pageValidator : PageValidator
  constructor () {
    this.pageService =  new PageService()
    this.pageValidator =  new PageValidator()
  }
  public async getPageByLimit(ctx : HttpContextContract) {
    await this.pageValidator.validatePageSchema(ctx)
    return this.pageService.getPageByLimit(ctx)
  }

  // async testing(ctx : HttpContextContract){
  //   return 'ok'
  //   const files = await imagemin([`${ctx.request.files('images')}/*.{jpg,png}`], {
  //     destination: 'build/images',
  //     plugins: [
  //       imageminJpegtran(),
  //       imageminPngquant({
  //         quality: [0.6, 0.8]
  //       })
  //     ]
  //   });
  //   return files
  // }
  async getCategory(){
      return this.pageService.getCategory()
  }
  async getAllPage(ctx : HttpContextContract){
      return this.pageService.getAllPage(ctx)
  }
  async addPage(ctx : HttpContextContract){
      await this.pageValidator.validateAddPageSchema(ctx)
      return this.pageService.addPage(ctx.request.all())
  }
  async editPage(ctx : HttpContextContract){
      await this.pageValidator.validateAddPageSchema(ctx)
      return this.pageService.editPage(ctx.request.all())
  }
  async getPageDetails(ctx : HttpContextContract){
      return this.pageService.getPageDetails(ctx)
  }

  public async uploadPagePic(ctx : HttpContextContract) {
    return this.pageService.uploadPagePic(ctx)
  }
  public async followPage(ctx : HttpContextContract) {
    return this.pageService.followPage(ctx)
  }
  public async getPageEditDetails(ctx : HttpContextContract) {
    return this.pageService.getPageEditDetails(ctx)
  }
  public async deletePage(ctx : HttpContextContract) {
    return this.pageService.deletePage(ctx)
  }

  public async getSingleStaticPage(ctx){
    return this.pageService.getSingleStaticPage(ctx)
  }


}
