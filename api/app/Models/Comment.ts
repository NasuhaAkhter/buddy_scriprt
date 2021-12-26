import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne, BelongsTo, HasOne} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Like from './Like'
import Commentlike from './Commentlike';

export default class Comment extends BaseModel {
  //public serializeExtras : boolean |null = true
  // extra data
  @column()
  public replies: Comment[]

  //extra data ends

  @column({ isPrimary: true })
  public id: number
  @column()
  public feedId: number
  @column()
  public userId: number
  @column()
  public reply_count: number
  @column()
  public like_count: number
  @column()
  public comment_txt: string
  @column()
  public parrent_id?: number
  
  @belongsTo(() => User,{
    onQuery: (query) => {
      query.select('id', 'first_name', 'last_name', 'username', 'profile_pic')
    }
  })
  public user : BelongsTo<typeof User>
  
  @hasOne(() => Like)
  public like : HasOne<typeof Like>
  @hasOne(() => Commentlike)
  public commentlike : HasOne<typeof Commentlike>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
