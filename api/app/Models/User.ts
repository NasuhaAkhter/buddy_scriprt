import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Friend from './Friend';
import Groupmember from './Groupmember';
import Eventinvite from './Eventinvite';
import Pagefollower from './Pagefollower';
import Transection from './Transection';
import Feed from './Feed';
import Block from './Block';
import Event from './Event';
import Group from './Group';
import Page from './Page';
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {

  public serializeExtras : boolean |null = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string
  @column()
  public first_name: string
  @column()
  public last_name: string
  @column()
  public gender: string
  @column()
  public profile_pic: string


  @column({ columnName: 'userType', serializeAs: 'userType' })
  public userType: string

  @column()
  public admin_status: string

  @column({ columnName: 'course_status', serializeAs: 'course_status' })
  public course_status: string

  @column()
  public member_expired_at: string

  @column({ columnName: 'appToken', serializeAs: 'appToken' })
  public appToken: string

  @column()
  public cover?: string
  @column({})
  public birth_date: string | null
  @column()
  public phone?: string
  @column()
  public website?: string
  @column()
  public workplace?: string
  @column()
  public nick_name?: string
  @column({ columnName: 'current_city', serializeAs: 'current_city' })
  public current_city?: string
  @column()
  public home_town?: string
  @column()
  public work_data?: string
  @column()
  public skill_data?: string
  @column()
  public education_data?: string
  @column()
  public default_feed?: string
  @column()
  public about?: string
  @column({ columnName: 'country', serializeAs: 'country' })
  public country?: string
  @column()
  public friend_count?: number
  @column()
  public msg_count?: number
  @column()
  public is_online?: string

  @column()
  public is_banned?: string


  @column()
  public username: string

  @column()
  public status: string

  @column({ columnName: 'password', serializeAs: 'password' })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  dark_mode : boolean

  @column({ serializeAs: null })
  public forgot_code: string

  @column({ serializeAs: null })
  public code_expired: string


  @hasMany(() => Friend)
  public isfriend : HasMany<typeof Friend>

  @hasMany(() => Transection,
  {
  foreignKey : 'user_id',
  })
  public trans : HasMany<typeof Transection>

  @hasMany(() => Feed,
  {
  foreignKey : 'userId',
  })
  public feed : HasMany<typeof Feed>

  @hasMany(() => Event,
  {
  foreignKey : 'userId',
  })
  public event : HasMany<typeof Event>

  @hasMany(() => Group,
  {
  foreignKey : 'userId',
  })
  public group : HasMany<typeof Group>

  @hasMany(() => Page,
  {
  foreignKey : 'userId',
  })
  public page : HasMany<typeof Page>

  @hasMany(() => Transection,
  {
  foreignKey : 'user_id',
  })
  public bill : HasMany<typeof Transection>

  @hasMany(() => Groupmember,{
    foreignKey : 'user_id',
    // onQuery: (query) => {
    //   query.select('id')
    // }
  })
  public isGroupMember : HasMany<typeof Groupmember>

  @hasMany(() => Pagefollower,{
    foreignKey : 'user_id',
  })
  public isPageFollower : HasMany<typeof Pagefollower>

  @hasMany(() => Eventinvite,{
    foreignKey : 'user_id',
  })
  public isinvitedInEvent : HasMany<typeof Eventinvite>


  @hasMany(() => Block,{
    foreignKey : 'blockedUserId'
  })
  public block : HasMany<typeof Block>

  @hasOne(() => Block, {
    localKey: 'id',
    foreignKey: 'blockedUserId',
  })
  public blockedUser : HasOne<typeof Block>
  @hasOne(() => Block, {
    localKey: 'id',
    foreignKey: 'userId',
  })
  public userBlocked : HasOne<typeof Block>

  @hasOne(() => Friend,{
     foreignKey : 'friendId'
  })
  public friend : HasOne<typeof Friend>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
