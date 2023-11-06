import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Movie from './Movie'

export default class WatchHistory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public movieId: number

  @column()
  public durationWatched: number

  @column()
  public isFinished: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // RELATIONSHIPS
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Movie)
  public movie: BelongsTo<typeof Movie>

}
