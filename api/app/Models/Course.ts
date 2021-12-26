import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo,HasMany,hasMany, column , hasOne,HasOne } from '@ioc:Adonis/Lucid/Orm'

import User from './User';
import CourseSubscriber from './CourseSubscriber';

export default class Course extends BaseModel {
  public serializeExtras = true
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number
  @column()
  public order_id: number
  @column()
  public activity_text: string
  @column()
  public activity_type: string
  @column()
  public description: string
  @column()
  public privacy: string
  @column()
  public views: number

  @column()
  public isPublished: string

  @column.date()
  public start_date_time: DateTime
  @column.date()
  public end_date_time: DateTime
  
  @column()
  public data  : string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime



  @belongsTo(() => User,{
    localKey: 'id',
    foreignKey: 'user_id',
    onQuery: (query) => {
      query.select('id', 'first_name', 'last_name', 'username', 'profile_pic')
    }
  })
  public user : BelongsTo<typeof User>

  @hasMany(() => CourseSubscriber,{
    localKey: 'id',
    foreignKey: 'course_id'
  })
  public subscribers : HasMany<typeof CourseSubscriber>

  @hasOne(() => CourseSubscriber,{
    localKey: 'id',
    foreignKey: 'course_id'
  })
  public isSubscriber : HasOne<typeof CourseSubscriber> 
}
