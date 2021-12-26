import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Savepost extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public user_id: number

  @column()
  public feed_id: number
  @column()
  public activity_type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
