import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CampaignEvent extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public user_id: number
  @column()
  public ad_id: number
  @column()
  public type: string
  @column()
  public budget: number
  @column()
  public spending: number
  @column()
  public refund: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
