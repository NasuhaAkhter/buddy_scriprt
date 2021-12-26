import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AdRate extends BaseModel {
  public serializeExtras : boolean |null = true
  
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public amount: number
  
  @column()
  public ad_type: string
  
  @column()
  public activity_type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
