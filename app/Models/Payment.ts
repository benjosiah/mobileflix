import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Subscription from './Subscription'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number
  
  @column()
  public subscriptionId: number

  @column()
  public amount: number

  @column()
  public description: string

  @column()
  public paymentStatus: string

  @column()
  public paymentMethod: string

  @column()
  public transactionId: string

  @column()
  public reference: string

  @column()
  public checkoutUrl: string | null

  @column()
  public paymentGateway: string


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // RELATIONSHIPS
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Subscription)
  public subscription: BelongsTo<typeof Subscription>


}
