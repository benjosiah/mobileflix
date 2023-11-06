import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Movie from './Movie'


export default class Season extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public seasonNumber: number

  @column()
  public movieId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // RELATIONSHIPS
  //episodes
  @hasMany(() => Movie, {
    foreignKey: 'seasonId'
  })
  public episodes: HasMany<typeof Movie>

}
