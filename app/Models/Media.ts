import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

  @column()
  public featuredImage: string

  @column()
  public icon: string

  @column()
  public status: string

  @column()
  public parentId: number

  @column()
  public mimeType: string

  @column()
  public fileName: string

  @column()
  public fileSize: string

  @column()
  public fileExtension: string

  @column()
  public duration: number

  @column()
  public object: Record<string, any>

  @column()
  public url: string

  @column()
  public playbackId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  
  //ACTION HOOKS

  //generate slug before create
  @beforeCreate()
  public static async generateSlug(media: Media) {
    var slug = media.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    //check if slug exists
    var slugExists = await Media.query().where('slug', slug);
    if (slugExists.length > 0) {
      slug = slug + '-' + Date.now()
    }
    media.slug = slug
  }


}
