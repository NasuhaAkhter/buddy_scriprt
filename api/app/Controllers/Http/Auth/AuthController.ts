import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from './AuthService';
import AuthValidator from './AuthValidator';
import User from 'App/Models/User'

import Database from '@ioc:Adonis/Lucid/Database';
export default class AuthController {
  private authService : AuthService
  private authValidator : AuthValidator
  constructor () {
    this.authService =  new AuthService()
    this.authValidator =  new AuthValidator()
  }
  async getAuthByLimit(ctx : HttpContextContract){
    return this.authService.sendEmailByMailjet()
  }
  async signup(ctx : HttpContextContract){
      //validate requests
      try {
        let validatedData = await this.authValidator.validateSignupSchema(ctx)
        return this.authService.createUser(validatedData, ctx)
      } catch (error) {
         return ctx.response.status(422).send(error.messages)
      }
      // await this.authValidator.validateSignupSchema(ctx)
      // return this.authService.createUser(ctx.request.all())

   }

  async login(ctx : HttpContextContract){

      try {
        let validatedData = await this.authValidator.validateLoginSchema(ctx)
        let data =ctx.request.all()
        data.email = validatedData.email
        data.password = validatedData.password

        return this.authService.webLogin(ctx)
      } catch (error) {
        return ctx.response.status(422).send(error.messages)
      }

   }


  async deleteAccount(  ctx: HttpContextContract){
    let user = await ctx.auth.user
    let data = ctx.request.all();
     if(data.id != user?.id) return ctx.response.status(401).send({ msg: 'You are not authorised.' })
     await this.authService.deleteAccount(data.id)
     await ctx.auth.logout()
    return ctx.response.status(403).send({msg:'Account deleted successfully.'})

  }

  async apiLogin(ctx : HttpContextContract){
      try {
        let validatedData = await this.authValidator.validateLoginSchema(ctx)
        let user = await this.authService.appLogin(validatedData,ctx)
        if(!user) return ctx.response.status(401).send({ msg: 'Invalid credentials.' })
        return user
      } catch (error) {
        return ctx.response.status(422).send({msg:error.messages})
      }
   }




  async getUser({ auth }) {

    try {
      const user = await auth.use('web').authenticate()
      const [notiCount, msgCount] = await Promise.all([
          Database.query().where('user_id', user.id).sum('counter as totalNoti').from('notifications').first(),
          Database.query().where('user_id', user.id).where('is_seen', 0).count('is_seen as totalUnseen').from('inboxes').first(),
      ])
      // const friend_count =
      if(user){
        //this.authService.updateOnline(user, 'online')
      }
      return {
        user,
        notiCount,
        msgCount,
        // friend_count
      }
    } catch (error) {
      //console.log('error is', error)
      return false
    }

  }

  async getUserApp({ auth }) {

    try {
      const authUsr :any = await auth.use('api').authenticate()

      let user ={
        id: authUsr.id,
        first_name: authUsr.first_name,
        last_name: authUsr.last_name,
        username: authUsr.username,
        email: authUsr.email,
        profile_pic: authUsr.profile_pic,
        friend_count: authUsr.friend_count,
      }
      // let user = await this.authService.fetchUSer(authUsr)
      const [notiCount, msgCount] = await Promise.all([
          Database.query().where('user_id', authUsr.id).sum('counter as totalNoti').from('notifications').first(),
          Database.query().where('user_id', authUsr.id).where('is_seen', 0).count('is_seen as totalUnseen').from('inboxes').first(),
      ])
      if(user){
       // this.authService.updateOnline(user, 'online')
      }
      return {
        user,
        notiCount,
        msgCount
      }
    } catch (error) {
      //console.log('error is', error)
      return false
    }

  }


  async logout({ auth }) {
    let user = await auth.use('web').authenticate()
    this.authService.updateOnline(user, 'offline')
    return await auth.logout()
  }

  async appLogout({ auth }) {
    let user = await auth.use('api').authenticate()
    this.authService.updateOnline(user, 'offline')
    await auth.use('api').revoke()
    return {
      revoked: true
    }
  }


  async csrfCookie(){
    return 'done'
  }

   async verifyEmail(ctx: HttpContextContract) {
     try{
       let validateData = await this.authValidator.validateVerificationData(ctx)
        let data =ctx.request.all()
        data.verificationCode =validateData.verificationCode
        data.email =validateData.email
        return this.authService.verifyEmail(ctx)
     }catch(error){
      return ctx.response.status(422).send(error.messages)
     }

    }
  async resendEmail(ctx: HttpContextContract){
    let data =ctx.request.all()
    let validatedData = await this.authValidator.validateResetSchema(ctx)
    data.email = validatedData.email
    let number = Math.floor(Math.random() * 899999 + 100000)
    let obj ={}
    let user:any = await User.query().where('email', data.email).first()
     if(user){
        obj ={
        username: user?.first_name +' '+user?.last_name,
        token:user?.forgot_code
      }
     }else{
      return ctx.response.status(401).send({ msg: 'You are not registered yet.Please signup first.' })
    }
   await this.authService.updateCode(user?.id, number)
   return this.authService.sendEmail(obj, data.email)
  }
  async sendResetToken(ctx : HttpContextContract){
    try {
      let validatedData = await this.authValidator.validateResetSchema(ctx)
      return this.authService.sendResetToken(ctx,validatedData)
    } catch (error) {
      return ctx.response.status(422).send(error.messages)
    }
   }


  async verifyCode(ctx: HttpContextContract) {
    try {
      let validatedData = await this.authValidator.validateTokenData(ctx)

      return this.authService.verifyCode(ctx, validatedData)
    } catch (error) {
      return ctx.response.status(422).send(error.messages)
    }

  }

  async passwordReset(ctx: HttpContextContract) {
    try {
      let validatedData = await this.authValidator.validateNewPasswordData(ctx)
      return this.authService.passwordReset(ctx, validatedData)
    } catch (error) {
      return ctx.response.status(422).send(error.messages)
    }

  }

  async getCountry(){
    // return [
    //   {
    //     "name": "Afghanistan"
    //   },
    //   {
    //     "name": "Åland Islands"
    //   },
    //   {
    //     "name": "Albania"
    //   },
    //   {
    //     "name": "Algeria"
    //   },
    //   {
    //     "name": "American Samoa"
    //   },
    //   {
    //     "name": "Andorra"
    //   },
    //   {
    //     "name": "Angola"
    //   },
    //   {
    //     "name": "Anguilla"
    //   },
    //   {
    //     "name": "Antarctica"
    //   },
    //   {
    //     "name": "Antigua and Barbuda"
    //   },
    //   {
    //     "name": "Argentina"
    //   },
    //   {
    //     "name": "Armenia"
    //   },
    //   {
    //     "name": "Aruba"
    //   },
    //   {
    //     "name": "Australia"
    //   },
    //   {
    //     "name": "Austria"
    //   },
    //   {
    //     "name": "Azerbaijan"
    //   },
    //   {
    //     "name": "Bahamas"
    //   },
    //   {
    //     "name": "Bahrain"
    //   },
    //   {
    //     "name": "Bangladesh"
    //   },
    //   {
    //     "name": "Barbados"
    //   },
    //   {
    //     "name": "Belarus"
    //   },
    //   {
    //     "name": "Belgium"
    //   },
    //   {
    //     "name": "Belize"
    //   },
    //   {
    //     "name": "Benin"
    //   },
    //   {
    //     "name": "Bermuda"
    //   },
    //   {
    //     "name": "Bhutan"
    //   },
    //   {
    //     "name": "Bolivia (Plurinational State of)"
    //   },
    //   {
    //     "name": "Bonaire, Sint Eustatius and Saba"
    //   },
    //   {
    //     "name": "Bosnia and Herzegovina"
    //   },
    //   {
    //     "name": "Botswana"
    //   },
    //   {
    //     "name": "Bouvet Island"
    //   },
    //   {
    //     "name": "Brazil"
    //   },
    //   {
    //     "name": "British Indian Ocean Territory"
    //   },
    //   {
    //     "name": "United States Minor Outlying Islands"
    //   },
    //   {
    //     "name": "Virgin Islands (British)"
    //   },
    //   {
    //     "name": "Virgin Islands (U.S.)"
    //   },
    //   {
    //     "name": "Brunei Darussalam"
    //   },
    //   {
    //     "name": "Bulgaria"
    //   },
    //   {
    //     "name": "Burkina Faso"
    //   },
    //   {
    //     "name": "Burundi"
    //   },
    //   {
    //     "name": "Cambodia"
    //   },
    //   {
    //     "name": "Cameroon"
    //   },
    //   {
    //     "name": "Canada"
    //   },
    //   {
    //     "name": "Cabo Verde"
    //   },
    //   {
    //     "name": "Cayman Islands"
    //   },
    //   {
    //     "name": "Central African Republic"
    //   },
    //   {
    //     "name": "Chad"
    //   },
    //   {
    //     "name": "Chile"
    //   },
    //   {
    //     "name": "China"
    //   },
    //   {
    //     "name": "Christmas Island"
    //   },
    //   {
    //     "name": "Cocos (Keeling) Islands"
    //   },
    //   {
    //     "name": "Colombia"
    //   },
    //   {
    //     "name": "Comoros"
    //   },
    //   {
    //     "name": "Congo"
    //   },
    //   {
    //     "name": "Congo (Democratic Republic of the)"
    //   },
    //   {
    //     "name": "Cook Islands"
    //   },
    //   {
    //     "name": "Costa Rica"
    //   },
    //   {
    //     "name": "Croatia"
    //   },
    //   {
    //     "name": "Cuba"
    //   },
    //   {
    //     "name": "Curaçao"
    //   },
    //   {
    //     "name": "Cyprus"
    //   },
    //   {
    //     "name": "Czech Republic"
    //   },
    //   {
    //     "name": "Denmark"
    //   },
    //   {
    //     "name": "Djibouti"
    //   },
    //   {
    //     "name": "Dominica"
    //   },
    //   {
    //     "name": "Dominican Republic"
    //   },
    //   {
    //     "name": "Ecuador"
    //   },
    //   {
    //     "name": "Egypt"
    //   },
    //   {
    //     "name": "El Salvador"
    //   },
    //   {
    //     "name": "Equatorial Guinea"
    //   },
    //   {
    //     "name": "Eritrea"
    //   },
    //   {
    //     "name": "Estonia"
    //   },
    //   {
    //     "name": "Ethiopia"
    //   },
    //   {
    //     "name": "Falkland Islands (Malvinas)"
    //   },
    //   {
    //     "name": "Faroe Islands"
    //   },
    //   {
    //     "name": "Fiji"
    //   },
    //   {
    //     "name": "Finland"
    //   },
    //   {
    //     "name": "France"
    //   },
    //   {
    //     "name": "French Guiana"
    //   },
    //   {
    //     "name": "French Polynesia"
    //   },
    //   {
    //     "name": "French Southern Territories"
    //   },
    //   {
    //     "name": "Gabon"
    //   },
    //   {
    //     "name": "Gambia"
    //   },
    //   {
    //     "name": "Georgia"
    //   },
    //   {
    //     "name": "Germany"
    //   },
    //   {
    //     "name": "Ghana"
    //   },
    //   {
    //     "name": "Gibraltar"
    //   },
    //   {
    //     "name": "Greece"
    //   },
    //   {
    //     "name": "Greenland"
    //   },
    //   {
    //     "name": "Grenada"
    //   },
    //   {
    //     "name": "Guadeloupe"
    //   },
    //   {
    //     "name": "Guam"
    //   },
    //   {
    //     "name": "Guatemala"
    //   },
    //   {
    //     "name": "Guernsey"
    //   },
    //   {
    //     "name": "Guinea"
    //   },
    //   {
    //     "name": "Guinea-Bissau"
    //   },
    //   {
    //     "name": "Guyana"
    //   },
    //   {
    //     "name": "Haiti"
    //   },
    //   {
    //     "name": "Heard Island and McDonald Islands"
    //   },
    //   {
    //     "name": "Holy See"
    //   },
    //   {
    //     "name": "Honduras"
    //   },
    //   {
    //     "name": "Hong Kong"
    //   },
    //   {
    //     "name": "Hungary"
    //   },
    //   {
    //     "name": "Iceland"
    //   },
    //   {
    //     "name": "India"
    //   },
    //   {
    //     "name": "Indonesia"
    //   },
    //   {
    //     "name": "Côte d'Ivoire"
    //   },
    //   {
    //     "name": "Iran (Islamic Republic of)"
    //   },
    //   {
    //     "name": "Iraq"
    //   },
    //   {
    //     "name": "Ireland"
    //   },
    //   {
    //     "name": "Isle of Man"
    //   },
    //   {
    //     "name": "Israel"
    //   },
    //   {
    //     "name": "Italy"
    //   },
    //   {
    //     "name": "Jamaica"
    //   },
    //   {
    //     "name": "Japan"
    //   },
    //   {
    //     "name": "Jersey"
    //   },
    //   {
    //     "name": "Jordan"
    //   },
    //   {
    //     "name": "Kazakhstan"
    //   },
    //   {
    //     "name": "Kenya"
    //   },
    //   {
    //     "name": "Kiribati"
    //   },
    //   {
    //     "name": "Kuwait"
    //   },
    //   {
    //     "name": "Kyrgyzstan"
    //   },
    //   {
    //     "name": "Lao People's Democratic Republic"
    //   },
    //   {
    //     "name": "Latvia"
    //   },
    //   {
    //     "name": "Lebanon"
    //   },
    //   {
    //     "name": "Lesotho"
    //   },
    //   {
    //     "name": "Liberia"
    //   },
    //   {
    //     "name": "Libya"
    //   },
    //   {
    //     "name": "Liechtenstein"
    //   },
    //   {
    //     "name": "Lithuania"
    //   },
    //   {
    //     "name": "Luxembourg"
    //   },
    //   {
    //     "name": "Macao"
    //   },
    //   {
    //     "name": "Macedonia (the former Yugoslav Republic of)"
    //   },
    //   {
    //     "name": "Madagascar"
    //   },
    //   {
    //     "name": "Malawi"
    //   },
    //   {
    //     "name": "Malaysia"
    //   },
    //   {
    //     "name": "Maldives"
    //   },
    //   {
    //     "name": "Mali"
    //   },
    //   {
    //     "name": "Malta"
    //   },
    //   {
    //     "name": "Marshall Islands"
    //   },
    //   {
    //     "name": "Martinique"
    //   },
    //   {
    //     "name": "Mauritania"
    //   },
    //   {
    //     "name": "Mauritius"
    //   },
    //   {
    //     "name": "Mayotte"
    //   },
    //   {
    //     "name": "Mexico"
    //   },
    //   {
    //     "name": "Micronesia (Federated States of)"
    //   },
    //   {
    //     "name": "Moldova (Republic of)"
    //   },
    //   {
    //     "name": "Monaco"
    //   },
    //   {
    //     "name": "Mongolia"
    //   },
    //   {
    //     "name": "Montenegro"
    //   },
    //   {
    //     "name": "Montserrat"
    //   },
    //   {
    //     "name": "Morocco"
    //   },
    //   {
    //     "name": "Mozambique"
    //   },
    //   {
    //     "name": "Myanmar"
    //   },
    //   {
    //     "name": "Namibia"
    //   },
    //   {
    //     "name": "Nauru"
    //   },
    //   {
    //     "name": "Nepal"
    //   },
    //   {
    //     "name": "Netherlands"
    //   },
    //   {
    //     "name": "New Caledonia"
    //   },
    //   {
    //     "name": "New Zealand"
    //   },
    //   {
    //     "name": "Nicaragua"
    //   },
    //   {
    //     "name": "Niger"
    //   },
    //   {
    //     "name": "Nigeria"
    //   },
    //   {
    //     "name": "Niue"
    //   },
    //   {
    //     "name": "Norfolk Island"
    //   },
    //   {
    //     "name": "Korea (Democratic People's Republic of)"
    //   },
    //   {
    //     "name": "Northern Mariana Islands"
    //   },
    //   {
    //     "name": "Norway"
    //   },
    //   {
    //     "name": "Oman"
    //   },
    //   {
    //     "name": "Pakistan"
    //   },
    //   {
    //     "name": "Palau"
    //   },
    //   {
    //     "name": "Palestine, State of"
    //   },
    //   {
    //     "name": "Panama"
    //   },
    //   {
    //     "name": "Papua New Guinea"
    //   },
    //   {
    //     "name": "Paraguay"
    //   },
    //   {
    //     "name": "Peru"
    //   },
    //   {
    //     "name": "Philippines"
    //   },
    //   {
    //     "name": "Pitcairn"
    //   },
    //   {
    //     "name": "Poland"
    //   },
    //   {
    //     "name": "Portugal"
    //   },
    //   {
    //     "name": "Puerto Rico"
    //   },
    //   {
    //     "name": "Qatar"
    //   },
    //   {
    //     "name": "Republic of Kosovo"
    //   },
    //   {
    //     "name": "Réunion"
    //   },
    //   {
    //     "name": "Romania"
    //   },
    //   {
    //     "name": "Russian Federation"
    //   },
    //   {
    //     "name": "Rwanda"
    //   },
    //   {
    //     "name": "Saint Barthélemy"
    //   },
    //   {
    //     "name": "Saint Helena, Ascension and Tristan da Cunha"
    //   },
    //   {
    //     "name": "Saint Kitts and Nevis"
    //   },
    //   {
    //     "name": "Saint Lucia"
    //   },
    //   {
    //     "name": "Saint Martin (French part)"
    //   },
    //   {
    //     "name": "Saint Pierre and Miquelon"
    //   },
    //   {
    //     "name": "Saint Vincent and the Grenadines"
    //   },
    //   {
    //     "name": "Samoa"
    //   },
    //   {
    //     "name": "San Marino"
    //   },
    //   {
    //     "name": "Sao Tome and Principe"
    //   },
    //   {
    //     "name": "Saudi Arabia"
    //   },
    //   {
    //     "name": "Senegal"
    //   },
    //   {
    //     "name": "Serbia"
    //   },
    //   {
    //     "name": "Seychelles"
    //   },
    //   {
    //     "name": "Sierra Leone"
    //   },
    //   {
    //     "name": "Singapore"
    //   },
    //   {
    //     "name": "Sint Maarten (Dutch part)"
    //   },
    //   {
    //     "name": "Slovakia"
    //   },
    //   {
    //     "name": "Slovenia"
    //   },
    //   {
    //     "name": "Solomon Islands"
    //   },
    //   {
    //     "name": "Somalia"
    //   },
    //   {
    //     "name": "South Africa"
    //   },
    //   {
    //     "name": "South Georgia and the South Sandwich Islands"
    //   },
    //   {
    //     "name": "Korea (Republic of)"
    //   },
    //   {
    //     "name": "South Sudan"
    //   },
    //   {
    //     "name": "Spain"
    //   },
    //   {
    //     "name": "Sri Lanka"
    //   },
    //   {
    //     "name": "Sudan"
    //   },
    //   {
    //     "name": "Suriname"
    //   },
    //   {
    //     "name": "Svalbard and Jan Mayen"
    //   },
    //   {
    //     "name": "Swaziland"
    //   },
    //   {
    //     "name": "Sweden"
    //   },
    //   {
    //     "name": "Switzerland"
    //   },
    //   {
    //     "name": "Syrian Arab Republic"
    //   },
    //   {
    //     "name": "Taiwan"
    //   },
    //   {
    //     "name": "Tajikistan"
    //   },
    //   {
    //     "name": "Tanzania, United Republic of"
    //   },
    //   {
    //     "name": "Thailand"
    //   },
    //   {
    //     "name": "Timor-Leste"
    //   },
    //   {
    //     "name": "Togo"
    //   },
    //   {
    //     "name": "Tokelau"
    //   },
    //   {
    //     "name": "Tonga"
    //   },
    //   {
    //     "name": "Trinidad and Tobago"
    //   },
    //   {
    //     "name": "Tunisia"
    //   },
    //   {
    //     "name": "Turkey"
    //   },
    //   {
    //     "name": "Turkmenistan"
    //   },
    //   {
    //     "name": "Turks and Caicos Islands"
    //   },
    //   {
    //     "name": "Tuvalu"
    //   },
    //   {
    //     "name": "Uganda"
    //   },
    //   {
    //     "name": "Ukraine"
    //   },
    //   {
    //     "name": "United Arab Emirates"
    //   },
    //   {
    //     "name": "United Kingdom of Great Britain and Northern Ireland"
    //   },
    //   {
    //     "name": "United States of America"
    //   },
    //   {
    //     "name": "Uruguay"
    //   },
    //   {
    //     "name": "Uzbekistan"
    //   },
    //   {
    //     "name": "Vanuatu"
    //   },
    //   {
    //     "name": "Venezuela (Bolivarian Republic of)"
    //   },
    //   {
    //     "name": "Viet Nam"
    //   },
    //   {
    //     "name": "Wallis and Futuna"
    //   },
    //   {
    //     "name": "Western Sahara"
    //   },
    //   {
    //     "name": "Yemen"
    //   },
    //   {
    //     "name": "Zambia"
    //   },
    //   {
    //     "name": "Zimbabwe"
    //   }
    // ]
    return [
      { "name": "Afghanistan", "code": "AF" },
      {"name": "Åland Islands", "code": "AX"},
      {"name": "Albania", "code": "AL"},
      {"name": "Algeria", "code": "DZ"},
      {"name": "American Samoa", "code": "AS"},
      {"name": "Andorra", "code": "AD"},
      {"name": "Angola", "code": "AO"},
      {"name": "Anguilla", "code": "AI"},
      {"name": "Antarctica", "code": "AQ"},
      {"name": "Antigua and Barbuda", "code": "AG"},
      {"name": "Argentina", "code": "AR"},
      {"name": "Armenia", "code": "AM"},
      {"name": "Aruba", "code": "AW"},
      {"name": "Australia", "code": "AU"},
      {"name": "Austria", "code": "AT"},
      {"name": "Azerbaijan", "code": "AZ"},
      {"name": "Bahamas", "code": "BS"},
      {"name": "Bahrain", "code": "BH"},
      {"name": "Bangladesh", "code": "BD"},
      {"name": "Barbados", "code": "BB"},
      {"name": "Belarus", "code": "BY"},
      {"name": "Belgium", "code": "BE"},
      {"name": "Belize", "code": "BZ"},
      {"name": "Benin", "code": "BJ"},
      {"name": "Bermuda", "code": "BM"},
      {"name": "Bhutan", "code": "BT"},
      {"name": "Bolivia", "code": "BO"},
      {"name": "Bosnia and Herzegovina", "code": "BA"},
      {"name": "Botswana", "code": "BW"},
      {"name": "Bouvet Island", "code": "BV"},
      {"name": "Brazil", "code": "BR"},
      {"name": "British Indian Ocean Territory", "code": "IO"},
      {"name": "Brunei Darussalam", "code": "BN"},
      {"name": "Bulgaria", "code": "BG"},
      {"name": "Burkina Faso", "code": "BF"},
      {"name": "Burundi", "code": "BI"},
      {"name": "Cambodia", "code": "KH"},
      {"name": "Cameroon", "code": "CM"},
      {"name": "Canada", "code": "CA"},
      {"name": "Cape Verde", "code": "CV"},
      {"name": "Cayman Islands", "code": "KY"},
      {"name": "Central African Republic", "code": "CF"},
      {"name": "Chad", "code": "TD"},
      {"name": "Chile", "code": "CL"},
      {"name": "China", "code": "CN"},
      {"name": "Christmas Island", "code": "CX"},
      {"name": "Cocos (Keeling) Islands", "code": "CC"},
      {"name": "Colombia", "code": "CO"},
      {"name": "Comoros", "code": "KM"},
      {"name": "Congo", "code": "CG"},
      {"name": "Congo, The Democratic Republic of the", "code": "CD"},
      {"name": "Cook Islands", "code": "CK"},
      {"name": "Costa Rica", "code": "CR"},
      {"name": "Cote D'Ivoire", "code": "CI"},
      {"name": "Croatia", "code": "HR"},
      {"name": "Cuba", "code": "CU"},
      {"name": "Cyprus", "code": "CY"},
      {"name": "Czech Republic", "code": "CZ"},
      {"name": "Denmark", "code": "DK"},
      {"name": "Djibouti", "code": "DJ"},
      {"name": "Dominica", "code": "DM"},
      {"name": "Dominican Republic", "code": "DO"},
      {"name": "Ecuador", "code": "EC"},
      {"name": "Egypt", "code": "EG"},
      {"name": "El Salvador", "code": "SV"},
      {"name": "Equatorial Guinea", "code": "GQ"},
      {"name": "Eritrea", "code": "ER"},
      {"name": "Estonia", "code": "EE"},
      {"name": "Ethiopia", "code": "ET"},
      {"name": "Falkland Islands (Malvinas)", "code": "FK"},
      {"name": "Faroe Islands", "code": "FO"},
      {"name": "Fiji", "code": "FJ"},
      {"name": "Finland", "code": "FI"},
      {"name": "France", "code": "FR"},
      {"name": "French Guiana", "code": "GF"},
      {"name": "French Polynesia", "code": "PF"},
      {"name": "French Southern Territories", "code": "TF"},
      {"name": "Gabon", "code": "GA"},
      {"name": "Gambia", "code": "GM"},
      {"name": "Georgia", "code": "GE"},
      {"name": "Germany", "code": "DE"},
      {"name": "Ghana", "code": "GH"},
      {"name": "Gibraltar", "code": "GI"},
      {"name": "Greece", "code": "GR"},
      {"name": "Greenland", "code": "GL"},
      {"name": "Grenada", "code": "GD"},
      {"name": "Guadeloupe", "code": "GP"},
      {"name": "Guam", "code": "GU"},
      {"name": "Guatemala", "code": "GT"},
      {"name": "Guernsey", "code": "GG"},
      {"name": "Guinea", "code": "GN"},
      {"name": "Guinea-Bissau", "code": "GW"},
      {"name": "Guyana", "code": "GY"},
      {"name": "Haiti", "code": "HT"},
      {"name": "Heard Island and Mcdonald Islands", "code": "HM"},
      {"name": "Holy See (Vatican City State)", "code": "VA"},
      {"name": "Honduras", "code": "HN"},
      {"name": "Hong Kong", "code": "HK"},
      {"name": "Hungary", "code": "HU"},
      {"name": "Iceland", "code": "IS"},
      {"name": "India", "code": "IN"},
      {"name": "Indonesia", "code": "ID"},
      {"name": "Iran, Islamic Republic Of", "code": "IR"},
      {"name": "Iraq", "code": "IQ"},
      {"name": "Ireland", "code": "IE"},
      {"name": "Isle of Man", "code": "IM"},
      {"name": "Israel", "code": "IL"},
      {"name": "Italy", "code": "IT"},
      {"name": "Jamaica", "code": "JM"},
      {"name": "Japan", "code": "JP"},
      {"name": "Jersey", "code": "JE"},
      {"name": "Jordan", "code": "JO"},
      {"name": "Kazakhstan", "code": "KZ"},
      {"name": "Kenya", "code": "KE"},
      {"name": "Kiribati", "code": "KI"},
      {"name": "Korea, Democratic People'S Republic of", "code": "KP"},
      {"name": "Korea, Republic of", "code": "KR"},
      {"name": "Kuwait", "code": "KW"},
      {"name": "Kyrgyzstan", "code": "KG"},
      {"name": "Lao People;S Democratic Republic", "code": "LA"},
      {"name": "Latvia", "code": "LV"},
      {"name": "Lebanon", "code": "LB"},
      {"name": "Lesotho", "code": "LS"},
      {"name": "Liberia", "code": "LR"},
      {"name": "Libyan Arab Jamahiriya", "code": "LY"},
      {"name": "Liechtenstein", "code": "LI"},
      {"name": "Lithuania", "code": "LT"},
      {"name": "Luxembourg", "code": "LU"},
      {"name": "Macao", "code": "MO"},
      {"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"},
      {"name": "Madagascar", "code": "MG"},
      {"name": "Malawi", "code": "MW"},
      {"name": "Malaysia", "code": "MY"},
      {"name": "Maldives", "code": "MV"},
      {"name": "Mali", "code": "ML"},
      {"name": "Malta", "code": "MT"},
      {"name": "Marshall Islands", "code": "MH"},
      {"name": "Martinique", "code": "MQ"},
      {"name": "Mauritania", "code": "MR"},
      {"name": "Mauritius", "code": "MU"},
      {"name": "Mayotte", "code": "YT"},
      {"name": "Mexico", "code": "MX"},
      {"name": "Micronesia, Federated States of", "code": "FM"},
      {"name": "Moldova, Republic of", "code": "MD"},
      {"name": "Monaco", "code": "MC"},
      {"name": "Mongolia", "code": "MN"},
      {"name": "Montserrat", "code": "MS"},
      {"name": "Morocco", "code": "MA"},
      {"name": "Mozambique", "code": "MZ"},
      {"name": "Myanmar", "code": "MM"},
      {"name": "Namibia", "code": "NA"},
      {"name": "Nauru", "code": "NR"},
      {"name": "Nepal", "code": "NP"},
      {"name": "Netherlands", "code": "NL"},
      {"name": "Netherlands Antilles", "code": "AN"},
      {"name": "New Caledonia", "code": "NC"},
      {"name": "New Zealand", "code": "NZ"},
      {"name": "Nicaragua", "code": "NI"},
      {"name": "Niger", "code": "NE"},
      {"name": "Nigeria", "code": "NG"},
      {"name": "Niue", "code": "NU"},
      {"name": "Norfolk Island", "code": "NF"},
      {"name": "Northern Mariana Islands", "code": "MP"},
      {"name": "Norway", "code": "NO"},
      {"name": "Oman", "code": "OM"},
      {"name": "Pakistan", "code": "PK"},
      {"name": "Palau", "code": "PW"},
      {"name": "Palestinian Territory, Occupied", "code": "PS"},
      {"name": "Panama", "code": "PA"},
      {"name": "Papua New Guinea", "code": "PG"},
      {"name": "Paraguay", "code": "PY"},
      {"name": "Peru", "code": "PE"},
      {"name": "Philippines", "code": "PH"},
      {"name": "Pitcairn", "code": "PN"},
      {"name": "Poland", "code": "PL"},
      {"name": "Portugal", "code": "PT"},
      {"name": "Puerto Rico", "code": "PR"},
      {"name": "Qatar", "code": "QA"},
      {"name": "Reunion", "code": "RE"},
      {"name": "Romania", "code": "RO"},
      {"name": "Russian Federation", "code": "RU"},
      {"name": "RWANDA", "code": "RW"},
      {"name": "Saint Helena", "code": "SH"},
      {"name": "Saint Kitts and Nevis", "code": "KN"},
      {"name": "Saint Lucia", "code": "LC"},
      {"name": "Saint Pierre and Miquelon", "code": "PM"},
      {"name": "Saint Vincent and the Grenadines", "code": "VC"},
      {"name": "Samoa", "code": "WS"},
      {"name": "San Marino", "code": "SM"},
      {"name": "Sao Tome and Principe", "code": "ST"},
      {"name": "Saudi Arabia", "code": "SA"},
      {"name": "Senegal", "code": "SN"},
      {"name": "Serbia and Montenegro", "code": "CS"},
      {"name": "Seychelles", "code": "SC"},
      {"name": "Sierra Leone", "code": "SL"},
      {"name": "Singapore", "code": "SG"},
      {"name": "Slovakia", "code": "SK"},
      {"name": "Slovenia", "code": "SI"},
      {"name": "Solomon Islands", "code": "SB"},
      {"name": "Somalia", "code": "SO"},
      {"name": "South Africa", "code": "ZA"},
      {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
      {"name": "Spain", "code": "ES"},
      {"name": "Sri Lanka", "code": "LK"},
      {"name": "Sudan", "code": "SD"},
      {"name": "Suriname", "code": "SR"},
      {"name": "Svalbard and Jan Mayen", "code": "SJ"},
      {"name": "Swaziland", "code": "SZ"},
      {"name": "Sweden", "code": "SE"},
      {"name": "Switzerland", "code": "CH"},
      {"name": "Syrian Arab Republic", "code": "SY"},
      {"name": "Taiwan, Province of China", "code": "TW"},
      {"name": "Tajikistan", "code": "TJ"},
      {"name": "Tanzania, United Republic of", "code": "TZ"},
      {"name": "Thailand", "code": "TH"},
      {"name": "Timor-Leste", "code": "TL"},
      {"name": "Togo", "code": "TG"},
      {"name": "Tokelau", "code": "TK"},
      {"name": "Tonga", "code": "TO"},
      {"name": "Trinidad and Tobago", "code": "TT"},
      {"name": "Tunisia", "code": "TN"},
      {"name": "Turkey", "code": "TR"},
      {"name": "Turkmenistan", "code": "TM"},
      {"name": "Turks and Caicos Islands", "code": "TC"},
      {"name": "Tuvalu", "code": "TV"},
      {"name": "Uganda", "code": "UG"},
      {"name": "Ukraine", "code": "UA"},
      {"name": "United Arab Emirates", "code": "AE"},
      {"name": "United Kingdom", "code": "GB"},
      {"name": "United States", "code": "US"},
      {"name": "United States Minor Outlying Islands", "code": "UM"},
      {"name": "Uruguay", "code": "UY"},
      {"name": "Uzbekistan", "code": "UZ"},
      {"name": "Vanuatu", "code": "VU"},
      {"name": "Venezuela", "code": "VE"},
      {"name": "Viet Nam", "code": "VN"},
      {"name": "Virgin Islands, British", "code": "VG"},
      {"name": "Virgin Islands, U.S.", "code": "VI"},
      {"name": "Wallis and Futuna", "code": "WF"},
      {"name": "Western Sahara", "code": "EH"},
      {"name": "Yemen", "code": "YE"},
      {"name": "Zambia", "code": "ZM"},
      {"name": "Zimbabwe", "code": "ZW"}
      ]

  }



}
