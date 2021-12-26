import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class NrcCourse extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string
  @column()
  public description: string
  @column()
  public cover: string
  @column()
  public link: string
  @column()
  public order_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
