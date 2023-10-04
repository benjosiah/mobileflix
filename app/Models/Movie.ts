import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import MovieClip from './MovieClip'
import Series from './Series'
import Season from './Season'

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public plot: string

  @column()
  public cast: any

  @column()
  public tags: string

  @column()
  public vidio_object: any

  @column()
  public is_series: boolean

  @column()
  public season_id: number

  @column()
  public episode: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => MovieClip, {
    foreignKey: 'movie_id',
  })
  public clips: HasMany<typeof MovieClip>

  @belongsTo(() => Series)
  public series: BelongsTo<typeof Series>

  @belongsTo(() => Season)
  public season: BelongsTo<typeof Season>

  public casts: any
}
