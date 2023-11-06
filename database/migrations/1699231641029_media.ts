import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')


      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.string('mime_type').nullable()
      table.string('file_name').nullable()
      table.string('file_size').nullable()
      table.string('file_extension').nullable()
      table.integer('duration').nullable().defaultTo(0) //in seconds
      table.string('url').notNullable()
      table.text('description').nullable()
      table.string('featured_image').nullable() //url
      table.string('icon').nullable()
      table.string('status').nullable()
      table.integer('parent_id').unsigned().nullable()

      table.json('object').nullable()

      table.string('playback_id').nullable() //for mux, cloudinary, etc

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
