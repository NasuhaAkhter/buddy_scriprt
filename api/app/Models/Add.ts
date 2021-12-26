import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'

import TrackAd from './TrackAd';
import User from './User';

export default class Add extends BaseModel {
  public serializeExtras: boolean | null = true
  @column({ isPrimary: true })
  public id: number
  @column()
  public budget: number
  @column()
  public spending_amount: number
  @column.date()
  public start_date_time: DateTime
  @column.date()
  public end_date_time: DateTime
  @column()
  public user_id: number
  @column.date()
  public age_from: DateTime
  @column.date()
  public age_to: DateTime
  @column()
  public feed_id: number
  @column()
  public page_id: number
  @column()
  public status: string
  @column()
  public data: string
  @column()
  public name: string
  @column()
  destination_url: string 
  @column()
  text: string
  @column()
  meta: any
  @column()
  gender: string
  @column()
  country: string
  @column()
  short_description: string
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>
  
  @hasMany(() => TrackAd, {
    foreignKey: 'ad_id',
  })
  public totalAdClick: HasMany<typeof TrackAd>

  @hasOne(() => TrackAd, {
    foreignKey: 'user_id',
  })
  public totalAdLike: HasOne<typeof TrackAd>

  @hasMany(() => TrackAd, {
    foreignKey: 'ad_id',
  })
  public totalAdImpression: HasMany<typeof TrackAd>
}
