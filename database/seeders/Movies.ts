import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Movie from 'App/Models/Movie'
import { DateTime } from 'luxon';
export default class extends BaseSeeder {
  public async run() {
    // PARENT MOVIE (MOVIE or SERIES)
    await Movie.createMany([
      // SINGLE MOVIE
      {
        title: "Inception",
        slug: "inception",
        userId: 1,
        description: "A mind-bending science fiction movie",
        genres: "Science Fiction, Action",
        type: "movie", //a single movie
        parentId: 0,
        seasonId: 0,
        duration: 148,
        averageRating: 4.5,
        releasedAt: DateTime.fromISO("2021-09-10T20:15:00.000Z"),
        videoId: 1,
        trailerId: 1, //reuse videoId as test
        clipId: 1, //reuse videoId as test
        featuredImageId: 3,
      },
      // SERIES
      {
        title: "The Matrix",
        slug: "the-matrix",
        userId: 2,
        description: "A classic cyberpunk action film",
        genres: "Action, Science Fiction",
        type: "series", //a series of movies (parent)
        parentId: 0,
        seasonId: 0, //it a parent itself
        duration: 136,
        averageRating: 4.8,
        releasedAt: DateTime.fromISO("2023-10-20T13:30:00.000Z"),
        videoId: 2,
        trailerId: 2, //reuse videoId as test
        clipId: 2, //reuse videoId as test
        featuredImageId: 4,
      },
    ]);

    // CHILD MOVIES (EPISODES)
    await Movie.createMany([
      // episode 1 of season 1
      {
        title: "The Matrix",
        slug: "the-matrix-episode-1",
        userId: 2,
        description: "A classic cyberpunk action film",
        genres: "Action, Science Fiction",
        type: "episode", //a single episode
        parentId: 2,
        seasonId: 1, //point to season from seasons table
        duration: 136,
        averageRating: 4.8,
        releasedAt: DateTime.fromISO("2023-10-20T13:30:00.000Z"),
      },
      // episode 2 of season 1
      {
        title: "The Matrix",
        slug: "the-matrix-episode-2",
        userId: 2,
        description: "A classic cyberpunk action film",
        genres: "Action, Science Fiction",
        type: "episode", //a single episode
        parentId: 2,
        seasonId: 1, //point to season from seasons table
        duration: 136,
        averageRating: 4.8,
        releasedAt: DateTime.fromISO("2023-10-20T13:30:00.000Z"),
      },
      // episode 1 of season 2
      {
        title: "The Matrix",
        slug: "the-matrix-episode-1",
        userId: 2,
        description: "A classic cyberpunk action film",
        genres: "Action, Science Fiction",
        type: "episode", //a single episode
        parentId: 2,
        seasonId: 2, //point to season from seasons table
        duration: 136,
        averageRating: 4.8,
        releasedAt: DateTime.fromISO("2023-10-20T13:30:00.000Z"),
      },
      // episode 2 of season 2
      {
        title: "The Matrix",
        slug: "the-matrix-episode-2",
        userId: 2,
        description: "A classic cyberpunk action film",
        genres: "Action, Science Fiction",
        type: "episode", //a single episode
        parentId: 2,
        seasonId: 2, //point to season from seasons table
        duration: 136,
        averageRating: 4.8,
        releasedAt: DateTime.fromISO("2023-10-20T13:30:00.000Z"),
      },

    ]);

  }


}
