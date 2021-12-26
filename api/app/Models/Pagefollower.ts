import { DateTime } from 'luxon'
import Page from './Page';

import { BaseModel, column, belongsTo,  BelongsTo} from '@ioc:Adonis/Lucid/Orm'


export default class Pagefollower extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  user_id  : number
  
  @column()
  pageId : number
  
  @belongsTo(() => Page, {
     foreignKey: 'pageId'
  })
  public page : BelongsTo<typeof Page>


}
