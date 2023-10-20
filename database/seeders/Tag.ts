import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Tag from 'App/Models/Tag'

export default class extends BaseSeeder {
  public async run () {
    await Tag.createMany([
      {
        name: "Action",
      },
      {
        name: "Comedy",
      },
      {
        name: "Drama",
      },
      {
        name: "Horror",
      },
      {
        name: "Romance",
      },
      {
        name: "Sci-fi",
      }
    ])
  }
}
