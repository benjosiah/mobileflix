import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('email')
      table.string('password')

      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      
      
      table.boolean('is_subscribed').defaultTo(false)
      table.integer('plan_id').nullable()

      table.string("avatar").nullable()

      table.boolean('email_verified').defaultTo(false)

      table.integer('account_id').unsigned().nullable() //current active watching account

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
