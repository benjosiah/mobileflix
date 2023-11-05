import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, BelongsTo, HasMany, HasOne, beforeSave, belongsTo, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Wallet from './Wallet'
import ResetToken from './ResetToken'
import Role from './Role'
import Account from './Account'
import Plan from './Plan'
import Subscription from './Subscription'
import Card from './Card'
import Review from './Review'
import Payment from './Payment'


export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public name: string

	@column()
	public email: string

	@column({ serializeAs: null }) //user password should not be serialized
	public password: string

	@column()
	public roleId: number

	@column()
	public isSubscribed: boolean

	@column()
	public planId: number | null

	@column()
	public emailVerified: boolean

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime



	// RELATIONSHIPS
	@belongsTo(() => Role)
	public role: BelongsTo<typeof Role>


	@hasMany(() => ResetToken)
	public resetTokens: HasMany<typeof ResetToken>


	@hasMany(() => Account)
	public accounts: HasMany<typeof Account>

	@hasOne(() => Wallet)
	public wallet: HasOne<typeof Wallet>

	@belongsTo(() => Plan)
	public plan: BelongsTo<typeof Plan>

	@hasMany(() => Subscription)
	public subscriptions: HasMany<typeof Subscription>

	@hasMany(() => Card)
	public cards: HasMany<typeof Card>

	@hasMany(() => Review)
	public reviews: HasMany<typeof Review>

	@hasMany(() => Payment)
	public payments: HasMany<typeof Payment>



	// hash password before saving to database
	@beforeSave()
	public static async hashPassword(user: User) {
		if (user.$dirty.password) {
			user.password = await Hash.make(user.password)
		}
	}


}


