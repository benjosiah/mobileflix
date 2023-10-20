import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = 'reset_tokens'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {

			table.increments('id').primary()

			table.string('email').notNullable().unique()
			table.string('token', 64).notNullable().unique()

			/**
			 * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('expires_at', {useTz: true}).nullable()
			table.timestamp('created_at', {useTz: true}).notNullable()
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
