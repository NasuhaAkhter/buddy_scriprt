import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { double } from 'aws-sdk/clients/lightsail'

export default class TrackAd extends BaseModel {
  // static findOrCreate(arg: { ad_id: any; user_id: any; ad_type: any; activity_type: any }) {
  //   throw new Error('Method not implemented.')
  // }
  @column({ isPrimary: true })
  public id: number
  @column()
  public ad_id: number
  @column()
  public activity_type: string
  @column()
  public ad_type: string
  @column()
  public user_id: number
  @column()
  public amount: double
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
