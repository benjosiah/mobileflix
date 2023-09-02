import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Series from './Series'
import Movie from './Movie'

export default class Season extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public title: string
  @column()
  public season_number: number

  @column()
  public series_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Movie, {
    foreignKey: 'season_id',
  })
  public movies: HasMany<typeof Movie>

  @belongsTo(() => Series)
  public series: BelongsTo<typeof Series>
}
