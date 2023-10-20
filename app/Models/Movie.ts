import { DateTime } from 'luxon'
import { BaseModel, HasMany, ManyToMany, beforeSave, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Cast from './Cast'
import Tag from './Tag'
import Season from './Season'
export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public userId: number

  @column()
  public description: string

  @column()
  public genres: string

  @column()
  public type: string

  @column()
  public videoObject: Record<string, any>

  @column()
  public parentId: number

  @column()
  public seasonId: number

  @column()
  public duration: number

  @column()
  public averageRating: number

  @column()
  public releasedAt: DateTime

  @column()
  public featuredImageUrl: string

  @column()
  public videoUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  // RELATIONSHIPS
  //casts
  @manyToMany(() => Cast, {
    pivotTable: 'term_relationships',
    pivotForeignKey: 'object_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'term_id',
    pivotColumns: ['object_type', 'term_type'],
    onQuery(query) {
      query.where('term_type', 'cast').where('object_type', 'movie')
    }
  })
  public casts: ManyToMany<typeof Cast>

  //tags
  @manyToMany(() => Tag, {
    pivotTable: 'term_relationships',
    pivotForeignKey: 'object_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'term_id',
    pivotColumns: ['object_type', 'term_type'],
    onQuery(query) {
      query.where('term_type', 'tag').where('object_type', 'movie')
    }
  })
  public tags: ManyToMany<typeof Tag>

  //seasons
  @hasMany(() => Season)
  public seasons: HasMany<typeof Season>

  //clips
  @hasMany(() => Movie, {
    foreignKey: 'parentId',
    onQuery(query) {
      query.where('type', 'clip')
    }
  })
  public clips: HasMany<typeof Movie>





  // ACTIONS
  //generate slug from title before saving
  @beforeSave()
  public static async generateSlug(movie: Movie) {
    if (movie.$dirty.title) {
      movie.slug = movie.title.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
    }
  }
 
}
