import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, ManyToMany, beforeCreate, belongsTo, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Cast from './Cast'
import Tag from './Tag'
import Season from './Season'
import Review from './Review'
import Media from './Media'
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
  public director: string

  @column()
  public clipId: number

  @column()
  public trailerId: number

  @column()
  public featuredImageId: number

  @column()
  public videoId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  // RELATIONSHIPS
  //featured image where this movie.featuredImageId = media.id
  @belongsTo(() => Media, {
    foreignKey: 'featuredImageId'
  })
  public featuredImage: BelongsTo<typeof Media>

  //video where this movie.videoId = media.id
  @belongsTo(() => Media, {
    foreignKey: 'videoId'
  })
  public video: BelongsTo<typeof Media>

  //trailer where this movie.trailerId = media.id
  @belongsTo(() => Media, {
    foreignKey: 'trailerId'
  })
  public trailer: BelongsTo<typeof Media>

  //clip where this movie.clipId = media.id
  @belongsTo(() => Media, {
    foreignKey: 'clipId'
  })
  public clip: BelongsTo<typeof Media> //active preview clip

  //clips where this movie.id = term_relationships.object_id and term_relationships.object_type = 'movie' and term_relationships.term_type = 'clip' and term_relationships.term_id = media.id
  @manyToMany(() => Media, {
    pivotTable: 'term_relationships',
    pivotForeignKey: 'object_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'term_id',
    pivotColumns: ['object_type', 'term_type'],
    onQuery(query) {
      query.where('object_type', 'movie').where('term_type', 'clip')
    }
  })
  public clips: ManyToMany<typeof Media> //other clips


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

  @hasMany(() => Review)
  public reviews: HasMany<typeof Review>





  // ACTIONS
  //generate slug from title before saving
  @beforeCreate()
  public static async generateSlug(movie: Movie) {
    var slug = movie.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    //check if slug exists
    var slugExists = await Movie.query().where('slug', slug);
    if (slugExists.length > 0) {
      slug = slug + '-' + Date.now()
    }
    movie.slug = slug
  }

}
