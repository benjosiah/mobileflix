import {DateTime} from 'luxon'
import {BaseModel, column, BelongsTo, belongsTo} from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Wallet extends BaseModel {
	@column({isPrimary: true})
	public id: number

	@column({isPrimary: true})
	public user_id: number

	@column()
	public balance: any

	@column.dateTime({autoCreate: true})
	public createdAt: DateTime

	@column.dateTime({autoCreate: true, autoUpdate: true})
	public updatedAt: DateTime

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>
}
