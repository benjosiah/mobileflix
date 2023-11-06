import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('subscription_id').unsigned().references('id').inTable('subscriptions');
      table.decimal('amount').notNullable();
      table.string('description').nullable();
      table.string('payment_status').notNullable();
      table.string('payment_method').nullable();
      table.string('transaction_id').nullable();
      table.string('reference').nullable().unique();
      table.string('checkout_url').nullable();
      table.string('payment_gateway').notNullable();

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
