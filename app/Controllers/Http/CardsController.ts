import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import ValidatorMessages from 'Config/validator_messages'

export default class CardsController {
    public async index({ response, auth }: HttpContextContract) {
        const user = auth.user!

        try {

            await user.load('cards')

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Cards fetched successfully",
                data: user.cards,
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
    public async add({ request, response, auth }: HttpContextContract) {
        const user = auth.user!

        //############################# Input Validation #############################
        const userSchema = schema.create({
            card_number: schema.string({ trim: true }, [
                rules.required(),
                rules.regex(/^[0-9]+$/),
            ]),
            card_type: schema.enum(['visa', 'mastercard', 'verve'] as const),
            card_name: schema.string({ trim: true }, [
                rules.required(),
                rules.minLength(3),
                rules.maxLength(50),
            ]),
            expiry_month: schema.number([
                rules.required(),
                rules.range(1, 12),
            ]),
            expiry_year: schema.number([
                rules.required(),
                rules.range(2021, 2050),
            ]),
            cvv: schema.number([
                rules.required(),
                rules.range(100, 999),
            ]),
            is_default: schema.boolean.optional(),
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

            //if is_default is set to true, then all already created cards should be set to false
            if (request.input('is_default', false)) {
                await user.related('cards').query().update({ is_default: false }) //set all cards to false
            }

            const card = await user.related('cards').create(
                request.only([
                    'card_number',
                    'card_type',
                    'card_name',
                    'expiry_month',
                    'expiry_year',
                    'cvv',
                    'is_default'
                ]))

            return response.created({
                status: "success",
                code: "SUCCESS",
                message: "Card added successfully",
                data: card,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code ?? "ERROR",
                message: error.message ?? "Something went wrong",
                data: null,
            })
        }
    }
    public async update({ request, response, auth }: HttpContextContract) {
        const user = auth.user!
        const id = request.param('id')

        try {

            const card = await user.related('cards').query().where('id', id).first();

            if (!card) {
                throw new Error('Card not found')
            }

            await card.merge(
                request.only([
                    'card_number',
                    'card_type',
                    'card_name',
                    'expiry_month',
                    'expiry_year',
                    'cvv',
                    'is_default'
                ])).save()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Card updated successfully",
                data: card,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code ?? "ERROR",
                message: error.message ?? "Something went wrong",
                data: null,
            })
        }
    }
    public async show({ request, response, auth }: HttpContextContract) {
        const user = auth.user!
        const id = request.param('id')

        try {

            const card = await user.related('cards').query().where('id', id).first();

            if (!card) {
                throw new Error('Card not found')
            }

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Card fetched successfully",
                data: card,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code ?? "ERROR",
                message: error.message ?? "Something went wrong",
                data: null,
            })
        }
    }
    public async delete({ request, response, auth }: HttpContextContract) {
        const user = auth.user!
        const id = request.param('id')

        try {

            const card = await user.related('cards').query().where('id', id).first();

            if (!card) {
                throw new Error('Card not found')
            }

            await card.delete()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Card deleted successfully",
                data: null,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code ?? "ERROR",
                message: error.message ?? "Something went wrong",
                data: null,
            })
        }
    }
    public async setDefault({ request, response, auth }: HttpContextContract) {
        const user = auth.user!
        const id = request.param('id')

        try {

            const card = await user.related('cards').query().where('id', id).first();

            if (!card) {
                throw new Error('Card not found')
            }

            await user.related('cards').query().update({ is_default: false }) //set all cards to false

            await card.merge({
                isDefault: true
            }).save()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Card set as default successfully",
                data: card,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code ?? "ERROR",
                message: error.message ?? "Something went wrong",
                data: null,
            })
        }
    }
    public async getDefault({ response, auth }: HttpContextContract) {
        const user = auth.user!

        try {

            const card = await user.related('cards').query().where('is_default', true).first();

            if (!card) {
                throw new Error('No default card found')
            }

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Default card fetched successfully",
                data: card,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code ?? "ERROR",
                message: error.message ?? "Something went wrong",
                data: null,
            })
        }
    }


}
