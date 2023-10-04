import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cast from 'App/Models/Cast'
// import CustomException from 'App/Exceptions/CustomException'
import Movie from 'App/Models/Movie'
import MovieClip from 'App/Models/MovieClip'
import Season from 'App/Models/Season'
import Series from 'App/Models/Series'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class MoviesController {
    public async GetAllMoviesAndSeries({response }: HttpContextContract) {
        const plans = await Movie.all()

        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: plans })
        
    }

    public async GetAllMovies({response, request }: HttpContextContract) {
        const moviesQuery = Movie.query().where('is_series', 0).preload('clips');

        // Specify the page number and number of items per page
        const page = request.input('page', 1); 
        const perPage = 10; // Number of items per page

        // Paginate the records
        const movies = await moviesQuery.paginate(page, perPage);


        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: movies })
        
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
        //   .with('seasons', (seasonsQuery) => {
        //     seasonsQuery.orderBy('season_number', 'asc'); // Sort seasons by season_number
        //     seasonsQuery.with('movies', (moviesQuery) => {
        //       moviesQuery.orderBy('episode', 'asc'); // Sort movies by episode
        //     });
        //   })
          .paginate(page, perPage);
        


        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: series })
        
    }

    public async GetMovie({response, params }: HttpContextContract) {
        const id = params.id
        let movie = await Movie.query().where('id', id).preload('clips').first()
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
                    });
                })
            }).first()

            if(series == null){
                return response.status(404).json({message: 'Movie was not found', status: "error"})
            }

            return response.status(201).json({ message: 'Subscription Plans', status: "success", data: series })
        }
   
        
        let casts = Array()
        movie.casts  = JSON.parse(movie.cast)
        
        for(let x =0; x < movie.casts.length; x++){
            let cast: Cast | null = await Cast.find(movie.casts[x])
            if(cast !== null){
                
                // let item = JSON.stringify(cast)
                casts.push(cast)
            }  
        }

        movie.cast = casts


        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: movie })
        
    }

    public async GetClips({response, request }: HttpContextContract) {
        const page = request.input('page', 1); 
        const perPage = 10; 
    
        // Query the MovieClip model to get random records
        const movieClips = await MovieClip.query()
          .orderByRaw('RANDOM()')
          .preload('movie')
          .paginate(page, perPage);
   
        
        


        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: movieClips })
        
    }

    public async getCasts({response }: HttpContextContract){
     
        // Query the MovieClip model to get random records
        const casts = await Cast.all()

        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: casts })
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
            casts: schema.string([
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
        movie.cast = payload.casts
        movie.tags = payload.tags
        movie.vidio_object = payload.video_object
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
        clip.vidio_object = payload.video_object
        await clip.save()
    
        return response.status(201).json({ message: 'clip Added Successfully', status: "success", data: clip  })
    }


}
