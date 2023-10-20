import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cast from 'App/Models/Cast'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import ValidatorMessages from 'Config/validator_messages'

export default class CastsController {
  public async index({ response }: HttpContextContract) {
    try {
      const casts = await Cast.all()
      return response.ok({
        status: 'success',
        code: "SUCCESS",
        message: "Casts fetched successfully",
        data: casts,
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        code: error.code,
        message: error.message || "An error occured while fetching casts",
        data: null,
      })
    }
  }

  public async create({ request, response }: HttpContextContract) {

    //############################# Input Validation #############################
    const castSchema = schema.create({
      name: schema.string([
        rules.required()
      ]),
      image: schema.string([
        rules.required()
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
      cast.image = input.image
      await cast.save()

      return response.ok({
        status: 'success',
        code: "SUCCESS",
        message: "Cast saved successfully",
        data: cast,
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

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
