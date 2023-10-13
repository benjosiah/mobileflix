import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cast from 'App/Models/Cast'
// import CustomException from 'App/Exceptions/CustomException'
import Movie from 'App/Models/Movie'
import MovieClip from 'App/Models/MovieClip'
import Season from 'App/Models/Season'
import Series from 'App/Models/Series'
import {rules, schema} from '@ioc:Adonis/Core/Validator'
import Env from "@ioc:Adonis/Core/Env";

export default class MoviesController {
    public async GetAllMoviesAndSeries({response }: HttpContextContract) {
        const plans = await Movie.all()

        return response.status(201).json({ message: '', status: "success", data: plans })

    }

    public async GetAllMovies({response, request }: HttpContextContract) {

        const moviesQuery = Movie.query().where('is_series', 0)
                                 .preload('clips')
                                 .preload('cast1')
                                 .preload('cast2')
                                 .preload('cast3')
                                 .preload('cast4')
                                 .preload('cast5')

        // Specify the page number and number of items per page
        const page = request.input('page', 1);
        const perPage = request.input('limit', 10); // Number of items per page

        // Paginate the records
        const movies = await moviesQuery.paginate(page, perPage);


        return response.status(201).json({ message: 'Movies', status: "success", data: movies })

    }

    public async GetAllShow({response, request }: HttpContextContract) {
        const page = request.input('page', 1);
        const perPage = 10;

        const series = await Series.query()
        .preload('season', (season)=>{
            season.orderBy('season_number', 'asc')
            .preload('movies', (moviesQuery) => {
                moviesQuery.orderBy('episode', 'asc')
                .preload('clips', (clipQuery)=>{
                    clipQuery.orderBy('id', 'asc');
                });
            });
        })
          .paginate(page, perPage);



        return response.status(201).json({ message: 'Series', status: "success", data: series })

    }

    public async GetMovie({response, params }: HttpContextContract) {
        const id = params.id
        let movie = await Movie.query().where('id', id)
                                .preload('clips')
                                .preload('cast1')
                                .preload('cast2')
                                .preload('cast3')
                                .preload('cast4')
                                .preload('cast5')
                                .first()
        if(movie == null){
            return response.status(404).json({message: 'Movie was not found', status: "error"})
        }
        if(movie.is_series){
            const season = await Season.find(movie.season_id)
            if(season == null){
                return response.status(404).json({message: 'Movie was not found', status: "error"})
            }
             let series = await Series.query().where('id', season.series_id)
            .preload('season', (seasonsQuery) => {
                seasonsQuery.orderBy('season_number', 'asc'); // Sort seasons by season_number
                seasonsQuery.preload('movies', (moviesQuery) => {
                    moviesQuery.orderBy('episode', 'asc');
                    moviesQuery.preload('clips', (clipQuery)=>{
                        clipQuery.orderBy('id', 'asc');
                    }).preload('cast1')
                    .preload('cast2')
                    .preload('cast3')
                    .preload('cast4')
                    .preload('cast5')
                })
            }).first()

            if(series == null){
                return response.status(404).json({message: 'Movie was not found', status: "error"})
            }

            return response.status(201).json({ message: 'Series', status: "success", data: series })
        }


        return response.status(201).json({ message: 'Mobie', status: "success", data: movie })

    }

    public async GetClips({response, request }: HttpContextContract) {
        const page = request.input('page', 1);
		const limit = request.input('limit', 10);

        // Query the MovieClip model to get random records
        const movieClips = await MovieClip.query()
          .orderByRaw(Env.get('DB_CONNECTION') === "pgsql" ? 'RANDOM()' : 'RAND()')
          .preload('movie', (moviesQuery) => {
            moviesQuery.preload('cast1')
            .preload('cast2')
            .preload('cast3')
            .preload('cast4')
            .preload('cast5')
          })
          .paginate(page, limit);





        return response.status(201).json({ message: 'Cinemo Clips', status: "success", data: movieClips })

    }

    public async getCasts({response }: HttpContextContract){

        // Query the MovieClip model to get random records
        const casts = await Cast.all()

        return response.status(201).json({ message: 'Casts', status: "success", data: casts })
    }

    public async saveCasts({response, request }: HttpContextContract){
        const castSchema = schema.create({
            name: schema.string([
                rules.required()
            ]),
            image: schema.string([
                rules.required()
            ]),
            })

            const payload = await request.validate({ schema: castSchema })

        const cast = new Cast()
        cast.name = payload.name
        cast.image = payload.image
        await cast.save()

        return response.status(201).json({ message: 'Cast Added Successfully', status: "success", data: cast  })
    }

    public async saveMovie({response, request }: HttpContextContract){
        const castSchema = schema.create({
            title: schema.string([
                rules.required()
            ]),
            plot: schema.string([
                rules.required()
            ]),
            cast1_id: schema.number([
                rules.required()
            ]),

            cast2_id: schema.number([
                rules.required()
            ]),
            cast3_id: schema.number([
                rules.required()
            ]),
            cast4_id: schema.number([
                rules.required()
            ]),
            cast5_id: schema.number([
                rules.required()
            ]),


            video_object: schema.string([
                rules.required()
            ]),
            tags: schema.string([
                rules.required()
            ]),

            })

            const payload = await request.validate({ schema: castSchema })

        const movie = new Movie()
        movie.title = payload.title
        movie.plot = payload.plot
        movie.cast1_id = payload.cast1_id
        movie.cast2_id = payload.cast2_id
        movie.cast3_id = payload.cast3_id
        movie.cast4_id = payload.cast4_id
        movie.cast5_id = payload.cast5_id
        movie.tags = payload.tags
        movie.video_object = payload.video_object
        await movie.save()

        return response.status(201).json({ message: 'Movie Added Successfully', status: "success", data: movie  })
    }

    public async saveMovieClip({response, request }: HttpContextContract){
        const castSchema = schema.create({
            movie_id: schema.number([
                rules.required()
            ]),
            video_object: schema.string([
                rules.required()
            ]),


            })

            const payload = await request.validate({ schema: castSchema })
            const movie = await Movie.find(payload.movie_id);

            if(movie == null){
                return
            }

        const clip = new MovieClip()
        clip.movie_id = payload.movie_id
        clip.video_object = payload.video_object
        await clip.save()

        return response.status(201).json({ message: 'clip Added Successfully', status: "success", data: clip  })
    }


}
