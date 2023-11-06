import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import ValidatorMessages from 'Config/validator_messages'

export default class WatchHistoriesController {
    public async index({ response, auth }: HttpContextContract) {
        const user = auth.user!

        try {

            const movies = await user.related('watchHistories').query()
                .preload('movie', (movie) => {
                    movie.preload('featuredImage')
                })
                .orderBy('created_at', 'desc')

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Watch histories fetched successfully",
                data: movies,
            })

        } catch (error) {
            return response.badRequest({
                status: "error",
                code: error.code ?? "ERROR",
                message: error.message ?? "Something went wrong",
                data: null,
            })
        }
    }
    public async add_or_update({ request, response, auth }: HttpContextContract) {
        const user = auth.user!

        //############################# Input Validation #############################
        const userSchema = schema.create({
            movie_id: schema.number([
                rules.exists({ table: 'movies', column: 'id' })
            ]),
            duration_watched: schema.number(),
        })
        // Re-format exception as a proper resonse for the Frontend Developer
        //always use try catch block to catch any error that may occur while validating user input, front-end developers won't undertsand exceptions
        try {
            await request.validate({ schema: userSchema, messages: ValidatorMessages })
        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code,
                message: error.messages?.errors[0]?.message,
                data: null
            })
        }
        //#############################End Input Validation #################################

        try {
            const movieId = request.input('movie_id')
            const durationWatched = request.input('duration_watched')

            const watchHistory = await user.related('watchHistories').query()
                .where('movie_id', movieId)
                .preload('movie', (movie) => {
                    movie.preload('video')
                })
                .first()

            if (watchHistory) {
                watchHistory.durationWatched = durationWatched
                //if duration watched is greater than 90% of movie duration, then set is_finished to true
                watchHistory.isFinished = durationWatched > ((watchHistory.movie.video?.duration ?? 0) * 0.9)
            } else {
                await user.related('watchHistories').create({
                    movieId: movieId,
                    durationWatched: durationWatched,
                    isFinished: durationWatched > 3600
                })
            }

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Watch history updated successfully",
                data: null,
            })

        } catch (error) {
            return response.badRequest({
                status: "error",
                code: error.code ?? "ERROR",
                message: error.message ?? "Something went wrong",
                data: null,
            })
        }
    }
    public async delete({ response, auth, params }: HttpContextContract) {
        const user = auth.user!
        const id = params.id

        try {

            const watchHistory = await user.related('watchHistories').query().where('id', id).first()

            if (!watchHistory) {
                throw Error("Watch history not found")
            }

            await watchHistory.delete()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Watch history deleted successfully",
                data: null,
            })

        } catch (error) {
            return response.badRequest({
                status: "error",
                code: error.code ?? "ERROR",
                message: error.message ?? "Something went wrong",
                data: null,
            })
        }
    }
}



