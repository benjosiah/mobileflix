import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.string('slug').nullable()
      table.integer('user_id').unsigned() //poster
      table.text('description').nullable()

      // table.text('plot').nullable() //@jesulonimii, what's the function of this column?
      // cast would be a model with relationship to movie
      // season would be a model with relationship to movie

      table.string('genres').nullable() //eg. Action, Drama, Comedy
      table.enum('type', ['movie', 'series', 'episode', 'documentary', 'show']).defaultTo('movie')

      

      //if type is episode, then parent_id point to the movie_id and season_id point to the season_id(Seasons table)
      table.integer('parent_id').nullable().defaultTo(0) //Only applicable to episodes [if type is episode, then parent_id is required]
      table.integer('season_id').nullable().defaultTo(0) //Only applicable to series [if type is episode, then season_id is required]

      table.integer('duration').nullable()
      table.decimal('average_rating', 2, 1).defaultTo(0.0)

      table.timestamp('released_at', { useTz: true })
      table.string('director').nullable()

      table.integer('clip_id').nullable() //a media id (active preview clip)
      table.integer('trailer_id').nullable(), //a media id
      table.integer('featured_image_id').nullable() //a media id
      table.integer('video_id').nullable() //a media id

      table.boolean('is_free').defaultTo(false)
      table.boolean('is_featured').defaultTo(false)
      table.boolean('is_premium').defaultTo(false)
      table.boolean('is_trending').defaultTo(false)


      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
