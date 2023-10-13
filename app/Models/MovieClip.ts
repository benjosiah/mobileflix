import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Movie from './Movie'

export default class MovieClip extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public video_object: any

  @column()
  public movie_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Movie,{
    foreignKey: 'movie_id',
  })
  public movie: BelongsTo<typeof Movie>
}
