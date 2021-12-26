import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Chat from './Chat'
import User from './User'

export default class Inbox extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId : number
  @column()
  public buddy_id : number
  @column()
  public is_deleted? : number
  @column()
  public inbox_key : string
  @column()
  public is_seen? : number
  @column()
  public is_group? : number
  @column()
  public group_name? : string
  @column()
  public group_logo? : string
 
  @belongsTo(() => Chat,{
    localKey : 'inbox_key',
    foreignKey : 'inbox_key',
    onQuery: (q) =>{
        q.orderBy('id', 'desc')
    }
  })
  public lastmsg : BelongsTo<typeof Chat>
  @belongsTo(() => User,{
    foreignKey : 'buddy_id',
    onQuery: (q) =>{
        q.select('id', 'first_name', 'last_name', 'username', 'profile_pic','is_online')
    }
  })
  public buddy : BelongsTo<typeof User>



  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
