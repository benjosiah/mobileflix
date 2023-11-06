import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Movie from './Movie'

export default class Cast extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public image: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // RELATIONSHIPS
  @manyToMany(() => Movie, {
    pivotTable: 'term_relationships',
    localKey: 'id',
    pivotForeignKey: 'term_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'object_id',
    pivotColumns: ['term_type', 'object_type'],
    serializeAs: 'movies',
    onQuery(query) {
      query.where('term_type', 'cast').where('object_type', 'movie')
    }
  })
  public movies: ManyToMany<typeof Movie>

}
