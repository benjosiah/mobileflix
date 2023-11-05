import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Season from 'App/Models/Season'

export default class extends BaseSeeder {
  public async run () {
    await Season.createMany([
      {
        title: "Season 1",
        seasonNumber: 1,
        movieId: 2, //movie that this season belongs to
      },
      {
        title: "Season 2",
        seasonNumber: 2,
        movieId: 2, //movie that this season belongs to
      }
    ])
  }
}
