import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'
import CustomHelpers from 'App/Helpers/CustomHelpers';
import FileValidator from 'App/Controllers/Http/FileValidator';
 
const  fs = require('fs');
// const { createWriteStream } = require("fs");

// const stream = require('stream');
// const { promisify } = require('util');
// const got = require('got');
// const pipeline = promisify(stream.pipeline);
export default class FilesController {
  private fileValidator : FileValidator
 
  constructor () {
    this.fileValidator =  new FileValidator()
 
 }
  
  async getobject(){
  
      let customHelpers = new CustomHelpers
    return customHelpers.getobject()
    
  }
  async uploadImages(ctx: HttpContextContract){
      let customHelpers = new CustomHelpers
      return  customHelpers.uploadImages(ctx)
    
  }
  async multipleImageUpload(ctx: HttpContextContract){
      let customHelpers = new CustomHelpers
      let data = ctx.request.all()
      const images = ctx.request.files('images')
      if(data.uploadType == 'image'){
        for (let image of images) {
          await this.fileValidator.multipleImageValidation(image, ctx.response )
        }
      }else{
        for (let image of images) {
          await this.fileValidator.multiplefileValidation(image, ctx.response)
        }
      }
         return await customHelpers.uploadImages3(ctx)
  }
  
  async uploadImages2(ctx: HttpContextContract){
      let customHelpers = new CustomHelpers
      return customHelpers.uploadImages2(ctx)
    
  }
  async serveImage({response, params} : HttpContextContract){

    return response.attachment(
      Application.publicPath('uploads', params.fileName)
    )
  }
  async serveVideo({response, params} : HttpContextContract){
    const video = fs.createReadStream(Application.publicPath('uploads', params.fileName))
     
    // await got('https://ewr1.vultrobjects.com/filestore/cksnalkrw000r4wv05wq9128i.mp4');
    // const video = await pipeline(
    //   got.stream('https://ewr1.vultrobjects.com/filestore/cksnalkrw000r4wv05wq9128i.mp4'),
    //   fs.createWriteStream('index.html')
    // );
    // const image = fs.createReadStream('https://www.w3schools.com/html/mov_bbb.ogg')
    // response.stream(image)
  //   const mp4Url = 'https://www.w3schools.com/html/mov_bbb.ogg';

  //  return  got.stream(mp4Url).pipe(response);


    response.stream(video)
  }
  async serveVideoStream({request,response, params} : HttpContextContract){
     try {
        // Ensure there is a range given for the video
      const range = request.headers().range;
      if (!range) {
          response.status(400).send("Requires Range header");
      }
      // get video stats (about 61MB)
      const videoPath = Application.publicPath('uploads', params.fileName)
      //  const videoPath = `https://ewr1.vultrobjects.com/filestore/cksnalkrw000r4wv05wq9128i.mp4`
      //  const videoPath  ="https://media0.giphy.com/media/4SS0kfzRqfBf2/giphy.gif";

      //  got.stream(url).pipe(createWriteStream('image.gif'));

      const videoSize = fs.statSync(videoPath).size;

      const CHUNK_SIZE = 10 ** 6; // 1MB
      let start = Number(range?.replace(/\D/g, ""));
     

      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

      // // Create headers
      const contentLength = end - start + 1;
      response.header('Content-Range',`bytes ${start}-${end}/${videoSize}`)
      response.header('Accept-Ranges',`bytes`)
      response.header('Content-Length',contentLength)
      response.header('Content-Type',`video/mp4`)

      response.status(206)
      // create video read stream for this particular chunk
      const videoStream = fs.createReadStream(videoPath, { start, end });
      response.stream(videoStream)
     } catch (error) {
        response.status(206)
     }

     




  }

  async testFile(){

    // if (await Drive.exists('avatar.jpg')) {
    //    await Drive.getUrl('avatar.jpg')
    // }
    // ctx.response.status(400).send("Requires Range header")

      //  Application.tmpPath('uploads')
    
    
      
       
    return await  Drive.getUrl('cdn')
  }

}
