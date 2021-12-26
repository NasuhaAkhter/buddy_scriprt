import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, hasOne, HasOne} from '@ioc:Adonis/Lucid/Orm'
import Groupmember from './Groupmember';
import Feed from './Feed';

export default class Group extends BaseModel {
  
  public serializeExtras : boolean |null = true
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public group_name: string
  
  @column()
  public slug : string

  @column()
  public profile_pic: string

  @column()
  public cover: string

  @column()
  public about?: string

  @column()
  public country : string

  @column()
  public city : string

  @column()
  public address : string

  @column()
  public group_privacy: string

  @column()
  public user_id: number
  @column()
  public total_members: number

  @column()
  public category_name: string
  @column()
  public is_edit: boolean
  

  @hasMany(() => Feed,
  {
  foreignKey : 'groupId',
  })
  public feed : HasMany<typeof Feed>
  
  @hasMany(() => Groupmember, {
    localKey: 'id',
    foreignKey: 'group_id',
  })
  public members : HasMany<typeof Groupmember>

  @hasOne(() => Groupmember,{
    foreignKey : 'group_id'
 })
 public is_member : HasOne<typeof Groupmember>

  // @belongsTo(() => Groupmember, {
  //   localKey: 'group_id',
  //   foreignKey: 'id',
  // })
  // public is_member : BelongsTo<typeof Groupmember>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
