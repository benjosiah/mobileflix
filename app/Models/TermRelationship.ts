import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TermRelationship extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public termId: number

  @column()
  public objectId: number

  @column()
  public objectType: string

  @column()
  public termType: string

  @column()
  public order: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

