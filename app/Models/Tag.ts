import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

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
  @beforeCreate()
  public static async generateSlug(tag: Tag) {
    var slug = tag.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    //check if slug exists
    var slugExists = await Tag.query().where('slug', slug);
    if (slugExists.length > 0) {
      slug = slug + '-' + Date.now()
    }
    tag.slug = slug
  }
}
