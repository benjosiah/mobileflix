import Factory from '@ioc:Adonis/Lucid/Factory'
import Movie from 'App/Models/Movie'
import MovieClip from 'App/Models/MovieClip'
import Season from 'App/Models/Season'
import Series from 'App/Models/Series'
import Cast from 'App/Models/Cast'

const cast = [1,3,5,6,6]
export const MoviesFactory = Factory
  .define(Movie, ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      plot: faker.lorem.paragraph(),
      cast: JSON.stringify(cast),
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

  export const CastFactory = Factory
  .define(Cast, ({ faker }) => {
    return {
      name: faker.lorem.words(2),
      image: "https://www.rwlasvegas.com/wp-content/uploads/2022/09/Kevin-Hart-Reality-Check-Press-Headshot.jpeg"
      
    }
  })
  .build()






