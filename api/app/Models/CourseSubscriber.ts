import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CourseSubscriber extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public course_id: number

  @column()
  public user_id: number

  @column()
  public coupon: string

  @column()
  public isActive: number

  @column()
  public expired_at: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
