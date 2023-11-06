import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, HasOne, belongsTo, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Payment from './Payment'
import Plan from './Plan'
import User from './User'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public planId: number

  @column()
  public startDate: Date

  @column()
  public endDate: Date

  @column()
  public status: string

  @column()
  public paymentId: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // RELATIONSHIPS
  @hasOne(() => Payment) //successfull payment
  public payment: HasOne<typeof Payment>

  @hasMany(() => Payment) //all successful & incomplete payments (for admin analysis)
  public payments: HasMany<typeof Payment>

  @belongsTo(() => Plan)
  public plan: BelongsTo<typeof Plan>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>



}
