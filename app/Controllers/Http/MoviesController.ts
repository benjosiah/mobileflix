import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Movie from 'App/Models/Movie'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import ValidatorMessages from 'Config/validator_messages';
import Drive from '@ioc:Adonis/Core/Drive'

export default class MoviesController {
    public async index({ response, request }: HttpContextContract) {

        const page = request.input('page', 1);
        const perPage = request.input('limit', 30); // Number of items per page

        const type = request.input('type'); //null for all
        const search = request.input('search'); //null for all

        try {
            let moviesQuery = Movie.query()
                .whereIn('type', ['movie', 'series', 'show']); // movies, series, and shows by default, don't include children like episodes and clips

            if (type) {
                moviesQuery = moviesQuery.where('type', type)
            }
            if (search) {
                moviesQuery = moviesQuery.where('title', 'LIKE', `%${search}%`)
            }

            //preload - NOTE: Not all relations needs to be preloaded for lising, but all are preloaded for single fetch by id
            moviesQuery = moviesQuery
                .preload('casts')
                .preload('tags')
                .preload('seasons')

            // Paginate the records
            const movies = await moviesQuery.paginate(page, perPage);

            return response.ok({
                status: 'success',
                code: "SUCCESS",
                message: "Movies fetched successfully",
                data: movies.serialize().data,
                meta: movies.serialize().meta,
            })

        } catch (error) {
            return response.internalServerError({
                status: 'error',
                code: error.code,
                message: error.message || "An error occured while fetching movies",
                data: null,
            })
        }
    }
    public async show({ response, params, request }: HttpContextContract) {
        const id = params.id



        try {
            let movie = await Movie.query().where('id', id)
                .preload('clips')
                .preload('casts')
                .preload('tags')
                .preload('seasons', (season) => {
                    season.preload('episodes')
                })
                .firstOrFail()


            // const movieFilePath = 'goldline/videos/laptop.mp4';
            const movieFilePath = 'goldline/videos/screen.mp4';
            // const movieFilePath = 'buildwyze/videos/properties/1698192140479-istockphoto-1277361554-640_adpp_is.mp4';

            const stats = await Drive.getStats(movieFilePath)
            const size = stats.size


            response.header('Content-Type', 'video/mp4')
            response.header('Accept-Ranges', 'bytes')
            response.header('Content-Length', size)
            response.header('Content-Range', `bytes 0-${size}/${size}`)


            const stream = await Drive.getStream(movieFilePath)

           
            response.stream(stream)



            // return response.ok({
            //     status: 'success',
            //     code: "SUCCESS",
            //     message: "Movie fetched successfully",
            //     data: movie,
            // })
        } catch (error) {
            return response.internalServerError({
                status: 'error',
                code: error.code,
                message: error.message || "An error occured while fetching movie",
                data: null,
            })
        }



    }

    public async addMovie({ response, request }: HttpContextContract) {

        //############################# Input Validation #############################
        const inputSchema = schema.create({
            title: schema.string([
                rules.required()
            ]),
        })
        // Re-format exception as a proper resonse for the Frontend Developer
        //always use try catch block to catch any error that may occur while validating user input, front-end developers won't undertsand exceptions
        try {
            await request.validate({ schema: inputSchema, messages: ValidatorMessages }) //@seunoyeniyi: I added messages for end user friendly error messages
        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code,
                message: error.messages?.errors[0]?.message,
                data: null
            })
        }
        //############################# End Input Validation #############################

        const input = request.all();

        try {
            const movie = new Movie();
            movie.title = input.title;
            movie.save();

            return response.ok({
                status: 'success',
                code: "SUCCESS",
                message: "Movie saved successfully",
                data: movie,
            })

        } catch (error) {
            return response.internalServerError({
                status: 'error',
                code: error.code,
                message: error.message || "An error occured while saving cast",
                data: null,
            })
        }

    }
}