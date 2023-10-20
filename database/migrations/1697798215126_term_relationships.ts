import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'term_relationships'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('term_id').unsigned().notNullable() //term_id is the cast_id, category_id, tag_id etc
      table.integer('object_id').unsigned().nullable() //object_id is the movie_id etc
      table.string('object_type').notNullable() //object_type is the type of object the term is related to e.g. movie etc
      table.string('term_type').notNullable() //term_type is the type of term e.g. cast, category, tag etc
      table.integer('order').unsigned().nullable() //you may want to order the terms in a particular way
      

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

