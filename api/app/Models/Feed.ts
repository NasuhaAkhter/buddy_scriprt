import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne, BelongsTo, HasOne, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Comment from 'App/Models/Comment'
import Campaign from 'App/Models/Campaign'
import Like from 'App/Models/Like'
import Friend from 'App/Models/Friend'
import Eventinvite from 'App/Models/Eventinvite'
import Groupmember from 'App/Models/Groupmember'
import Pagefollower from 'App/Models/Pagefollower'
import Event from 'App/Models/Event'
import Group from 'App/Models/Group'
import Page from 'App/Models/Page'
import Savepost from 'App/Models/Savepost'
import Block from 'App/Models/Block'
export default class Feed extends BaseModel {
  // extra properties
  public serializeExtras = true
  @column()
  public comments : Comment[]
  @column()
  public adds :any

  @column()
  public campaign : Campaign
  @column()
  public is_ad_post : boolean

  // extra proeprties end
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public userId: number
  
  @column({ serializeAs: 'groupId' })
  public groupId: number

  @column()
  public feed_txt: string
  @column()
  public files: string
  @column()
  public feed_privacy: string
  @column()
  public like_count: number
  @column()
  public comment_count: number
  @column()
  public share_count: number
  @column()
  public name: string
  @column()
  public is_feed_edit: string
  @column()
  public url: string
  @column()
  public slug: string
  @column()
  public uid: number
  @column()
  public pic: string
  @column()
  public meta_data: string
  @column()
  public activity_type: string
  @column()
  public file_type?: string
  @column()
  public pageId?: number
  @column()
  public eventId?: number
  @column()
  public share_id ?: number
  
  @column()
  public feed_from: string
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @belongsTo(() => User,{
    onQuery: (query) => {
      query.select('id', 'first_name', 'last_name', 'username', 'profile_pic')
    }
  })
  public user : BelongsTo<typeof User>
  
  @belongsTo(() => Page)
  public page : BelongsTo<typeof Page>

  @belongsTo(() => Event)
  public event: BelongsTo<typeof Event>
  
  @belongsTo(() => Group)
  public group: BelongsTo<typeof Group>
  
  @belongsTo(() => Feed,{
    foreignKey: 'share_id'
  })
  public share : BelongsTo<typeof Feed>
  
  @belongsTo(() => Pagefollower,{
    localKey: 'pageId',
    foreignKey: 'pageId'
  })
  public is_page_follow: BelongsTo<typeof Pagefollower>
  


  @hasOne(() => Like)
  public like : HasOne<typeof Like>

  @hasOne(() => Friend,{
    localKey: 'userId',
    foreignKey: 'userId'
  })
  public friend : HasOne<typeof Friend>

  @hasOne(() => Block,{
    localKey: 'userId',
    foreignKey: 'blockedUserId'
  })
  public blockedUser : HasOne<typeof Block>
  @hasOne(() => Block,{
    localKey: 'userId',
    foreignKey: 'userId'
  })
  public userBlocked : HasOne<typeof Block>

  @belongsTo(() => Savepost,{
    localKey: 'feed_id',
    foreignKey: 'id'
  })
  public savedPosts : BelongsTo<typeof Savepost>
 

  // @hasOne(() => Add, {
  //   localKey: 'id',
  //   foreignKey: 'feed_id'
  // })
  // public adds : HasOne<typeof Add>

//################33333############33333##  new and checked relations ###################333333333333#########

  @hasOne(() => Pagefollower, {
    localKey: 'pageId',
    foreignKey: 'pageId'
  })
  public is_page_followed: HasOne<typeof Pagefollower>

  @hasOne(() => Eventinvite, {
    localKey: 'eventId',
    foreignKey: 'event_id',
    onQuery: (query) => {
        query.select('id').whereIn('status',['going','interested'])
      }
  })
  public is_event_invited: HasOne<typeof Eventinvite>

//################33333##############33333##  new and checked relations ###################333333333333#########

  // @belongsTo(() => Pagefollower, {
  //   localKey: 'page_id',
  //   foreignKey: 'page_id'
  // })
  // public is_page_follow: BelongsTo<typeof Pagefollower>

  @hasMany(() => Eventinvite,{
    localKey: 'event_id',
    foreignKey: 'event_id'
  })
  public events: HasMany<typeof Eventinvite>

  @hasMany(() => Groupmember,{
    localKey: 'group_id',
    foreignKey: 'group_id'
  })
  public groups: HasMany<typeof Groupmember>

  @hasMany(() => Pagefollower,{
    localKey: 'page_id',
    foreignKey: 'page_id'
  })
  public pages: HasMany<typeof Pagefollower>




  //@hasMany(() => Comment)






}
