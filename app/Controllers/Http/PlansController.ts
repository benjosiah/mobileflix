import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Plan from 'App/Models/Plan'
import ValidatorMessages from 'Config/validator_messages'



export default class PlansController {
    public async index({ response }: HttpContextContract) {

        try {

            const plans = await Plan.all()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Plans fetched successfully",
                data: plans,
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
    public async show({ params, response }: HttpContextContract) {

        try {

            const plan = await Plan.find(params.id)

            if (!plan) {
                throw new Error('Plan not found')
            }

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Plan fetched successfully",
                data: plan,
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
    public async add({ request, response }: HttpContextContract) {
        //############################# Input Validation #############################
        const userSchema = schema.create({
            name: schema.string({ trim: true }, [
                rules.required(),
                rules.minLength(3),
                rules.maxLength(50),
            ]),
            description: schema.string({ trim: true }, [
                rules.required(),
                rules.minLength(3),
                rules.maxLength(50),
            ]),
            price: schema.number([
                rules.required(),
                rules.range(0, 1000000),
            ]),
            validity_days: schema.number([
                rules.required(),
                rules.range(1, 365),
            ]),
            max_devices: schema.number([
                rules.required(),
                rules.range(1, 10),
            ]),
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

            const plan = await Plan.create(
                request.only(['name', 'description', 'price', 'validity_days', 'max_devices'])
            )

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Plan created successfully",
                data: plan,
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
    public async update({ params, request, response }: HttpContextContract) {

        try {

            const plan = await Plan.find(params.id)

            if (!plan) {
                throw new Error('Plan not found')
            }

            await plan.merge(
                request.only(['name', 'description', 'price', 'validity_days', 'max_devices'])
            ).save()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Plan updated successfully",
                data: plan,
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
    public async delete({ params, response }: HttpContextContract) {

        try {

            const plan = await Plan.find(params.id)

            if (!plan) {
                throw new Error('Plan not found')
            }

            await plan.delete()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Plan deleted successfully",
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
