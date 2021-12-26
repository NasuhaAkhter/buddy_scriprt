import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  userId : number
  @column()
  msg : string
  @column()
  inbox_key : string
  @column()
  is_deleted : number
  @column()
  files : string
  @column()
  is_seen : boolean


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
