import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Movie from 'App/Models/Movie'

export default class MoviesController {
    public async index({ response, request }: HttpContextContract) {

        const page = request.input('page', 1);
        const perPage = request.input('limit', 30); // Number of items per page

        const type = request.input('type'); //null for all
        const search = request.input('search'); //null for all
        const tag = request.input('tag'); //null for all

        try {
            let query = Movie.query()

            if (type) {
                query = query.where('type', type)
            } else {
                query = query.whereIn('type', ['movie', 'series', 'show']); // movies, series, and shows by default, don't include children like episodes and clips

            }

            if (search) {
                //search by title or tag or cast, either in lower or upper case
                query = query.whereRaw('LOWER(title) LIKE ?', [`%${search.toLowerCase()}%`])
                    .orWhereHas('tags', (query) => {
                        query.whereRaw('LOWER(name) LIKE ?', [`%${search.toLowerCase()}%`])
                    })
                    .orWhereHas('casts', (query) => {
                        query.whereRaw('LOWER(name) LIKE ?', [`%${search.toLowerCase()}%`])
                    })
            }

            if (tag) {
                //search by tag, either in lower or upper case
                query = query.whereHas('tags', (query) => {
                    query.whereRaw('LOWER(name) LIKE ?', [`%${tag.toLowerCase()}%`])
                })
            }


            query = query
                .preload('featuredImage') //only featured image is required for listing (no need to preload all relationships), for faster performance


            // Paginate the records
            const movies = await query.paginate(page, perPage);

            return response.ok({
                status: 'success',
                code: "SUCCESS",
                message: "Movies fetched successfully",
                data: movies.serialize().data,
                meta: movies.serialize().meta,
            })

        } catch (error) {
            return response.badRequest({
                status: 'error',
                code: error.code || "ERR_MOVIES_NOT_FOUND",
                message: error.message || "An error occured while fetching movies",
                data: null,
            })
        }
    }

    public async show({ response, params }: HttpContextContract) {
        const id = params.id

        try {
            let movie = await Movie.query().where('id', id)
                .preload('featuredImage')
                .preload('trailer')
                .preload('video')
                .preload('clip')
                .preload('clips')
                .preload('casts')
                .preload('tags')
                .preload('seasons', (season) => {
                    season.preload('episodes')
                })
                .first()

            if (!movie) {
                throw Error("Movie not found")
            }


            return response.ok({
                status: 'success',
                code: "SUCCESS",
                message: "Movie fetched successfully",
                data: movie,
            })
        } catch (error) {
            return response.badRequest({
                status: 'error',
                code: error.code || "ERR_MOVIE_NOT_FOUND",
                message: error.message || "An error occured while fetching movie",
                data: null,
            })
        }



    }

}