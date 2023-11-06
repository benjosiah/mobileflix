import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PaymentsController {
    public async index({ response, auth }: HttpContextContract) {
        const user = auth.user!

        try {

            await user.load('payments', (query) => {
                query.preload('subscription')
            })

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Payments fetched successfully",
                data: user.payments,
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
    public async show({ request, response, auth }: HttpContextContract) {
        const user = auth.user!
        const id = request.param('id')

        try {

            const payment = await user.related('payments').query()
                .where('id', id)
                .preload('subscription')
                .first();

            if (!payment) {
                throw new Error('Payment not found')
            }

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Payment fetched successfully",
                data: payment,
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
