import Factory from '@ioc:Adonis/Lucid/Factory'
import Movie from 'App/Models/Movie'
import MovieClip from 'App/Models/MovieClip'
import Season from 'App/Models/Season'
import Series from 'App/Models/Series'


export const MoviesFactory = Factory
  .define(Movie, ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      plot: faker.lorem.paragraph(),
      cast: faker.lorem.words(),
      tags: faker.lorem.words(),
    }
  })
  .relation('clips', () => ClipFactory) 
  .build()

  export const SeriesFactory = Factory
  .define(Series, ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      plot: faker.lorem.paragraph(),
      cast: faker.lorem.words(),
      tags: faker.lorem.words()
    }
  })
  .relation('season', () => SeasonFactory) 
  .build()

  export const SeasonFactory = Factory
  .define(Season, ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
    }
  })
  .relation('movies', () => MoviesFactory) 
  .build()

  export const ClipFactory = Factory
  .define(MovieClip, ({ faker }) => {
    return {
        vidio_object: faker.lorem.sentences()
    }
  })
  .build()






