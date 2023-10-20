import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cast from 'App/Models/Cast'

export default class extends BaseSeeder {
  public async run() {
    await Cast.createMany([
      { name: "Will Smith" }, // 1
      { name: "Tom Hanks" }, // 2
      { name: "Jennifer Lawrence" }, // 3
      { name: "Brad Pitt" }, // 4
      { name: "Scarlett Johansson" }, // 5
    ]);
  }
}
