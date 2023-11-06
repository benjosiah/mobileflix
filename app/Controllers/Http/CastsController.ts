import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cast from 'App/Models/Cast'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import ValidatorMessages from 'Config/validator_messages'
import Movie from 'App/Models/Movie'
import TermRelationship from 'App/Models/TermRelationship'

export default class CastsController {
  public async index({ request, response }: HttpContextContract) {
    try {

      const perPage = request.input('perPage', 100)
      const page = request.input('page', 1)

      const casts = await Cast.query().paginate(page, perPage)


      return response.ok({
        status: 'success',
        code: "SUCCESS",
        message: "Casts fetched successfully",
        data: casts.serialize().data,
        meta: casts.serialize().meta
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        code: error.code,
        message: error.message || "An error occured while fetching casts",
        data: null,
        meta: null,
      })
    }
  }
  public async show({ params, response }: HttpContextContract) {
    try {
      const cast = await Cast.find(params.id)

      if (!cast) {
        throw Error("Cast not found")
      }

      await cast.load('movies')

      return response.ok({
        status: 'success',
        code: "SUCCESS",
        message: "Cast fetched successfully",
        data: cast,
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        code: error.code || "ERR_CAST_NOT_FOUND",
        message: error.message || "An error occured while fetching cast",
        data: null,
      })
    }
  }
  public async create({ request, response }: HttpContextContract) {

    //############################# Input Validation #############################
    const castSchema = schema.create({
      name: schema.string([
        rules.required(),
        rules.unique({ table: 'casts', column: 'name' })
      ]),
      movie_id: schema.number.optional([
        rules.exists({ table: 'movies', column: 'id' })
      ]),
    })
    // Re-format exception as a proper resonse for the Frontend Developer
    //always use try catch block to catch any error that may occur while validating user input, front-end developers won't undertsand exceptions
    try {
      await request.validate({ schema: castSchema, messages: ValidatorMessages }) //@seunoyeniyi: I added messages for end user friendly error messages
    } catch (error) {
      return response.badRequest({
        status: "failed",
        code: error.code,
        message: error.messages?.errors[0]?.message,
        data: null
      })
    }
    //############################# Input Validation #############################

    const input = request.all();

    try {

      const cast = new Cast()
      cast.name = input.name
      await cast.save()

      //if movie_id is provided, add cast to movie
      if (input.movie_id) {
        const movie = await Movie.findOrFail(input.movie_id)
        await TermRelationship.create({
          termId: cast.id,
          termType: "cast",
          objectId: movie.id,
          objectType: "movie",
        })
      }

      await cast.load('movies')

      return response.ok({
        status: 'success',
        code: "SUCCESS",
        message: "Cast saved successfully",
        data: cast,
      })

    } catch (error) {
      return response.badRequest({
        status: 'error',
        code: error.code || "ERR_CAST_NOT_SAVED",
        message: error.message || "An error occured while saving cast",
        data: null,
      })
    }

  }
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const cast = await Cast.find(params.id)

      if (!cast) {
        throw Error("Cast not found")
      }

      await cast.merge(request.only([
        'name',
      ])).save()

      return response.ok({
        status: 'success',
        code: "SUCCESS",
        message: "Cast updated successfully",
        data: cast,
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        code: error.code || "ERR_CAST_NOT_UPDATED",
        message: error.message || "An error occured while updating cast",
        data: null,
      })
    }
  }
  public async delete({ params, response }: HttpContextContract) {
    try {
      const cast = await Cast.find(params.id)

      if (!cast) {
        throw Error("Cast not found")
      }

      await cast.delete()

      return response.ok({
        status: 'success',
        code: "SUCCESS",
        message: "Cast deleted successfully",
        data: null,
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        code: error.code || "ERR_CAST_NOT_DELETED",
        message: error.message || "An error occured while deleting cast",
        data: null,
      })
    }
  }

}
