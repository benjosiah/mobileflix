import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Movie from './Movie'

export default class MovieClip extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public vidio_object: string

  @column()
  public movie_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Movie)
  public movie: BelongsTo<typeof Movie>
}
