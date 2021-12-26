import { DateTime } from 'luxon'

import Eventinvite from './Eventinvite';
import { BaseModel, BelongsTo, belongsTo, column,hasMany,HasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Feed from './Feed';

export default class Event extends BaseModel {
  public serializeExtras : boolean |null = true
  
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  event_name : string
  @column()
  slug : string
  @column()
  cover : string
  @column()
  about : string
  @column()
  is_published : boolean
  @column()
  country : string
  @column()
  city : string
  @column()
  address : string
  @column()
  start_time : DateTime
  @column()
  end_time : DateTime
  @column()
  user_id : number
  @column()
  event_id : number

  @hasOne(() => Eventinvite, {
    localKey: 'id',
    foreignKey: 'event_id', 
  })
  public isFollowing : HasOne<typeof Eventinvite>
  
  @belongsTo(() => User, {
    foreignKey: 'user_id', 
    onQuery: (q) =>{
      q.select('id', 'first_name', 'last_name', 'profile_pic', 'username')
    }
  })
  public user : BelongsTo<typeof User>

  @hasMany(() => Feed,
  {
  foreignKey : 'eventId',
  })
  public feed : HasMany<typeof Feed>
  
  @hasMany(() => Eventinvite, {
    foreignKey: 'event_id'
  })
  public event : HasMany<typeof Eventinvite>

  @hasMany(() => Eventinvite, {
    localKey: 'id',
    foreignKey: 'event_id',
    onQuery: (query) => {
      query.select('id').where('status','going')
    }
  })
  public going : HasMany<typeof Eventinvite>

  @hasMany(() => Eventinvite, {
    localKey: 'id',
    foreignKey: 'event_id',
    onQuery: (query) => {
      query.select('id').where('status','interested')
    }
  })
  public interested : HasMany<typeof Eventinvite>

}
