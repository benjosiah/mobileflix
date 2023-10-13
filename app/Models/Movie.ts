import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import MovieClip from './MovieClip'
import Series from './Series'
import Season from './Season'
import Cast from './Cast'

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public plot: string

  @column()
  public cast1_id: number

  @column()
  public cast2_id: number

  @column()
  public cast3_id: number

  @column()
  public cast4_id: number

  @column()
  public cast5_id: number

  @column()
  public tags: string

  @column()
  public genres: string

  @column()
  public video_object: any

  @column()
  public is_series: boolean

  @column()
  public season_id: number

  @column()
  public episode: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => MovieClip, {
    foreignKey: 'movie_id',
  })
  public clips: HasMany<typeof MovieClip>

  @belongsTo(() => Series)
  public series: BelongsTo<typeof Series>

  @belongsTo(() => Season)
  public season: BelongsTo<typeof Season>

  @belongsTo(() => Cast, {
    foreignKey: 'cast1_id',
  })
  public cast1: BelongsTo<typeof Cast>

  @belongsTo(() => Cast, {
    foreignKey: 'cast2_id',
  })
  public cast2: BelongsTo<typeof Cast>


  @belongsTo(() => Cast, {
    foreignKey: 'cast3_id',
  })
  public cast3: BelongsTo<typeof Cast>


  @belongsTo(() => Cast, {
    foreignKey: 'cast4_id',
  })
  public cast4: BelongsTo<typeof Cast>


  @belongsTo(() => Cast, {
    foreignKey: 'cast5_id',
  })
  public cast5: BelongsTo<typeof Cast>

// @computed()
//  public get casts() {
//     return this.getCasts(this.cast)
//   }

//   public async getCasts(cast: any) {
//     let casts = Array()
//     let list = JSON.parse(cast)
//     // return cast
//     for(let x =0; x < list.length; x++){
//          cast = await Cast.find(1)

//         if(cast !== null){
//             casts.push(cast)
//         }
//     }
//     // console.log(casts)
//     return casts

//   }
}
