import { DateTime } from 'luxon'
// import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User';

export default class BillTopUp extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public user_id: number
  @column()
  public tax: number
  @column()
  public bill_id: number
  @column()
  public amount: number
  @column()
  public total: number
  @column()
  public payment_id: string
  @column()
  public reason: string
  @column()
  public card_number: string
  @column()
  public json: string
  @column()
  public receipt_url: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @belongsTo(() => User, {
    foreignKey: 'user_id', 
  })
  public user : BelongsTo<typeof User>
  
  
}
