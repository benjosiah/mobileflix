import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'movie_clips'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.json('vidio_object')
      table.integer('movie_id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
