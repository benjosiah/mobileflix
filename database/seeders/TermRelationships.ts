import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TermRelationship from 'App/Models/TermRelationship'

export default class extends BaseSeeder {
  public async run() {
    // CASTS
    await TermRelationship.createMany([
      //casts for movie 1
      {
        termId: 1, //Will Smith
        termType: "cast",
        objectId: 1, //movie id
        objectType: "movie",
      },
      {
        termId: 2, //Tom Hanks
        termType: "cast",
        objectId: 1, //movie id
        objectType: "movie",
      },
      {
        termId: 3, //Jennifer Lawrence
        termType: "cast",
        objectId: 1, //movie id
        objectType: "movie",
      },
      //casts for movie 2
      {
        termId: 1, //Will Smith
        termType: "cast",
        objectId: 2, //movie id
        objectType: "movie",
      },
      {
        termId: 2, //Tom Hanks
        termType: "cast",
        objectId: 2, //movie id
        objectType: "movie",
      },
      {
        termId: 3, //Jennifer Lawrence
        termType: "cast",
        objectId: 2, //movie id
        objectType: "movie",
      },
      {
        termId: 4, //Brad Pitt
        termType: "cast",
        objectId: 2, //movie id
        objectType: "movie",
      },
      {
        termId: 5, //Scarlett Johansson
        termType: "cast",
        objectId: 2, //movie id
        objectType: "movie",
      },
    ]);
    //TAGS
    await TermRelationship.createMany([

      // TAGS
      //tags for movie 1
      {
        termId: 1, //Action
        termType: "tag",
        objectId: 1, //movie id
        objectType: "movie",
      },
      {
        termId: 2, //Comedy
        termType: "tag",
        objectId: 1, //movie id
        objectType: "movie",
      },
      //tags for movie 2
      {
        termId: 1, //Action
        termType: "tag",
        objectId: 2, //movie id
        objectType: "movie",
      },
      {
        termId: 2, //Comedy
        termType: "tag",
        objectId: 2, //movie id
        objectType: "movie",
      },
      {
        termId: 3, //Drama
        termType: "tag",
        objectId: 2, //movie id
        objectType: "movie",
      },
      {
        termId: 4, //Horror
        termType: "tag",
        objectId: 2, //movie id
        objectType: "movie",
      },


    ]);
  }
}
