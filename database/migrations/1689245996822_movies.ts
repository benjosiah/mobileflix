import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.string('slug')
      table.integer('user_id').unsigned().references('id').inTable('users') //poster
      table.text('description').nullable()

      // table.json('video_object') //@jesulonimii, what's the function of this column?
      // table.text('plot').nullable() //@jesulonimii, what's the function of this column?
      // cast would be a model with relationship to movie
      // season would be a model with relationship to movie

      table.string('genres').nullable() //eg. Action, Drama, Comedy
      table.enum('type', ['movie', 'series', 'episode', 'documentary', 'trailer']).defaultTo('movie')

      //if type is episode, then parent_id point to the movie_id and season_id point to the season_id(Seasons table)
      table.integer('parent_id').nullable() //Only applicable to episodes [if type is episode, then parent_id is required]
      table.integer('season_id').nullable() //Only applicable to series [if type is episode, then season_id is required]

      table.integer('duration').nullable()
      table.decimal('average_rating', 2, 1).defaultTo(0.0)

      table.timestamp('released_at', { useTz: true })

      table.string('featured_image_url').nullable() //eg. https://www.example.com/image.jpg
     
      table.string('video_url').nullable() //eg. https://www.example.com/video.mp4


      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
