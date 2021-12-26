import { DateTime } from 'luxon'
import User from './User';
import Event from './Event';

import { BaseModel, column,belongsTo,BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class Eventinvite extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @column()
  user_id : number
  
  @column()
  from_user_id : number
  
  @column()
  event_id : number
  
  @column()
  status : string
  
  @belongsTo(() => User,{
    foreignKey : 'user_id',
    onQuery: (q) =>{
        q.select('id', 'first_name', 'last_name', 'profile_pic', 'username')
    }
  })
  public friend : BelongsTo<typeof User> 
  
  @belongsTo(() => User,{
    foreignKey : 'from_user_id',
    onQuery: (q) =>{
        q.select('id', 'first_name', 'last_name', 'profile_pic', 'username')
    }
  })
  public from_user : BelongsTo<typeof User> 

  @belongsTo(() => Event, {
    foreignKey: 'event_id'
 })
 public event : BelongsTo<typeof Event>
}
