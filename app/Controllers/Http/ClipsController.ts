import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Movie from 'App/Models/Movie';

export default class ClipsController {
  public async index({request, response}: HttpContextContract) {
    const page = request.input('page', 1);
    const limit = request.input('limit', 30);

    try {
        let clips = await Movie.query().where('type', 'clip')
            .preload('casts')
            .preload('tags')
            .paginate(page, limit)

        return response.ok({
            status: 'success',
            code: "SUCCESS",
            message: "Clips fetched successfully",
            data: clips.serialize().data,
            meta: clips.serialize().meta,
        })
    } catch (error) {
        return response.internalServerError({
            status: 'error',
            code: error.code,
            message: error.message || "An error occured while fetching clips",
            data: null,
        })
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
