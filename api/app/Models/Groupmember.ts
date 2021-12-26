import { DateTime } from 'luxon'
import { BaseModel, column ,  belongsTo,  BelongsTo,} from '@ioc:Adonis/Lucid/Orm'
import User from './User';

export default class Groupmember extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column( )
  public user_id: number

  @column()
  public group_id: number

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  public user : BelongsTo<typeof User>

  @column()
  public is_admin: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
