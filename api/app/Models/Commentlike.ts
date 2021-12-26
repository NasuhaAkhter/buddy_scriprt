import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Commentlike extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public userId: number
  @column()
  public commentId: number


}
