import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.json('vidio_object')
      table.text('plot').nullable()
      table.integer('cast1_id')
      table.integer('cast2_id')
      table.integer('cast3_id').nullable()
      table.integer('cast4_id').nullable()
      table.integer('cast5_id').nullable()
      table.string('tags').nullable()
      table.string('genres').nullable()
      table.boolean('is_series').defaultTo(false)
      table.bigInteger('season_id').nullable()
      table.integer('episode').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
