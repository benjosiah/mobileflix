import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public parentId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  // ACTIONS
  @beforeSave()
  public static async slugify(tag: Tag) {
    if (tag.$dirty.slug) {
      tag.slug = tag.slug.toLowerCase().replace(/ /g, '-')
    }
  }
}
