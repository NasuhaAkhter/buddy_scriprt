// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CommonService from '../../Common/commonService';
import PageQuery from './PageQuery';
export default class PageService {
    private pageQuery : PageQuery
    private commonService : CommonService
    constructor(){
      this.pageQuery = new PageQuery
      this.commonService = new CommonService
    } 

    public async getAllPage(ctx :any){
      let data = ctx.request.all()
      let fData = await this.commonService.formatedData(data)
      let page = await this.pageQuery.getAllPage(fData)
      let pageCount = await this.pageQuery.pageCount()
      return ctx.response.send({page, pageCount})

    }

    public async test(){
        return this.pageQuery.test()

    }

    public async getSinglePage(ctx): Promise<any>{
      let id = ctx.params.id
        let page :any = await this.pageQuery.getSinglePage('id',id)
        return page
    }


    public async deletePage(ctx :any): Promise<any>{
      let data = ctx.request.all()
      let auth = await ctx.auth.use('web').authenticate()
      if(!auth || auth.id !=data.admin_id || auth.userType != 1){
        return ctx.response.status(401).send({ message: 'Your are not authorised Admin!' })
      }
      return this.pageQuery.deletePage('id', data.pageId)

    }


    //all-count-functions

    public async allCountations(ctx){
      return this.pageQuery.allCountations(ctx)
    }

    public async staticPages(){
      return this.pageQuery.staticPages()
    }

    public async editStaticPages(ctx){
      return this.pageQuery.editStaticPages(ctx);
    }


};
