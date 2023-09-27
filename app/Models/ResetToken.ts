import {DateTime} from 'luxon'
import {BaseModel, column} from '@ioc:Adonis/Lucid/Orm'


export default class ResetToken extends BaseModel {
	@column({isPrimary: true})
	public id: number

	@column()
	public email: string

	@column()
	public token: string

	@column.dateTime({autoCreate: true, autoUpdate: true})
	public createdAt: DateTime

	@column.dateTime()
	public expiresAt: DateTime

}
