import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import CustomException from 'App/Exceptions/CustomException'
import Movie from 'App/Models/Movie'
import MovieClip from 'App/Models/MovieClip'
import Season from 'App/Models/Season'
import Series from 'App/Models/Series'

export default class MoviesController {
    public async GetAllMoviesAndSeries({response }: HttpContextContract) {
        const plans = await Movie.all()

        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: plans })
        
    }

    public async GetAllMovies({response, request }: HttpContextContract) {
        const moviesQuery = Movie.query().where('is_series', 0);

        // Specify the page number and number of items per page
        const page = request.input('page', 1); // Get the page number from the request or default to 1
        const perPage = 10; // Number of items per page

        // Paginate the records
        const movies = await moviesQuery.paginate(page, perPage);


        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: movies })
        
    }

    public async GetAllShow({response, request }: HttpContextContract) {
        const page = request.input('page', 1); // Get the page number from the request or default to 1
        const perPage = 10; // Number of items per page
        
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
   
        
        


        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: movie })
        
    }

    public async GetClips({response, request }: HttpContextContract) {
        const page = request.input('page', 1); 
        const perPage = 10; 
    
        // Query the MovieClip model to get random records
        const movieClips = await MovieClip.query()
          .orderByRaw('RANDOM()')
          .paginate(page, perPage);
   
        
        


        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: movieClips })
        
    }
}
