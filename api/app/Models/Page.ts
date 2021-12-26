import { DateTime } from 'luxon'
import Pagefollower from './Pagefollower';
import { BaseModel, belongsTo, BelongsTo, column,hasMany, HasMany,hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Feed from './Feed';

export default class Page extends BaseModel {
  public serializeExtras = true
  
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  user_id  : number
  @column()
  page_name : string
  @column()
  page_title : string
  @column()
  slug  : string
  @column()
  category_name  : string
  @column()
  profile_pic : string
  @column()
  cover : string
  @column()
  about : string
  @column()
  is_published : boolean
  @column()
  website : string
  @column()
  phone : string
  @column()
  email : string
  @column()
  country : string
  @column()
  city : string
  @column()
  address : string
  @column()
  total_page_likes : number
  
  @hasMany(() => Feed,
  {
  foreignKey : 'pageId',
  })
  public feed : HasMany<typeof Feed>
  
  @hasMany(() => Pagefollower, {
    localKey: 'id',
    foreignKey: 'pageId',
  })
  public pageFollowers : HasMany<typeof Pagefollower>
  @hasOne(() => Pagefollower, {
    localKey: 'id',
    foreignKey: 'pageId',
  })
  public isFollowing : HasOne<typeof Pagefollower>
  
  @belongsTo(() => User, {
    // localKey: 'user_id',
    foreignKey: 'user_id'
  })
  public user : BelongsTo<typeof User>
}
