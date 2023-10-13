import {DateTime} from 'luxon'
import {BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import Wallet from './Wallet'
import Subscription from './Subscription'
import Plan from './Plan'

export default class User extends BaseModel {
	@column({isPrimary: true})
	public id: number

	@column()
	public name: string

	@column()
	public email: string

	@column()
	public password: string

	@column()
	public is_subscribed: boolean

	@column()
	public plan_id: number

	@column.dateTime({autoCreate: true})
	public createdAt: DateTime

	@column.dateTime({autoCreate: true, autoUpdate: true})
	public updatedAt: DateTime


	@hasMany(() => Account, {
		foreignKey: 'user_id',
	})
	public accounts: HasMany<typeof Account>

	@hasOne(() => Wallet, {
		foreignKey: 'user_id',
		localKey: 'id',
	})
	public wallet: HasOne<typeof Wallet>

	@hasOne(() => Subscription)
	public subscription: HasOne<typeof Subscription>

	@belongsTo(() => Plan, {
		foreignKey: 'plan_id',
	})
	public plan: BelongsTo<typeof Plan>
}


