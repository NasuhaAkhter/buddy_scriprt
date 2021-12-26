import { BaseModel,BelongsTo,belongsTo,column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'


export default class Friend extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public userId: number
  @column()
  public friendId: number
  @column()
  public status: string
  
  @belongsTo(() => User,{
    foreignKey : 'friendId',
    onQuery: (q) =>{
        q.select('id', 'first_name', 'last_name', 'profile_pic', 'username')
    }
  })
  public friend : BelongsTo<typeof User>




}
