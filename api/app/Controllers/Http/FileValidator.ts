import { schema } from '@ioc:Adonis/Core/Validator'
export default class FileValidator{
    
    public async multiplefileValidation(images, response){
      const fileValidateSchema = schema.create({
        images: schema.file({
            size: '25mb',
            extnames: ['pdf', 'ppt', 'pptx', 'docx', 'zip'],
          }),

      })
      const msg =  {
        'images.required': 'File is required',
        'images.size': ' File size must be in 25 mb. like pdf, ppt, pptx, docx, zip',
        'images.extnames': ' File size must be file format',
      }
      try {
        const payload = await images.validate({ schema: fileValidateSchema, messages : msg })
        return payload
      } catch (error) {
         return response.status(422).send(error.messages)
      }
    }
    public async multipleImageValidation(images, response){
        const imageValidateSchema = schema.create({
            images: schema.file({
                size: '5mb',
                extnames: ['jpg', 'jpeg', 'png'],
              }),
    
          })
          const msg =  {
            'images.required': 'Image is required',
            'images.size': ' File size must be in 5 mb',
            'images.extnames': ' File size must be image format .like jpeg, jpg ,png',
          }
          try {
            const payload = await images.validate({ schema: imageValidateSchema, messages : msg })
            return payload
          } catch (error) {
             return response.status(422).send(error.messages)
          }
    }
     
}
