import Factory from '@ioc:Adonis/Lucid/Factory'
import Movie from 'App/Models/Movie'
import MovieClip from 'App/Models/MovieClip'
import Season from 'App/Models/Season'
import Series from 'App/Models/Series'
import Cast from 'App/Models/Cast'

export const MoviesFactory = Factory
  .define(Movie, ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      plot: faker.lorem.paragraph(),
      cast1_id: 2,
      cast2_id: 1,
      cast3_id: 4,
      cast4_id: 6,
      cast5_id: 8,
      tags: "80s, old-school, romance, teens",
      genres: "comedy, romance"
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
      tags: "80s, old-school, romance, teens",
      genres: "comedy, romance"

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
        video_object: faker.lorem.sentences()
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






