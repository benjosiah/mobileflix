import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Payment from 'App/Models/Payment'
import Subscription from 'App/Models/Subscription'

export default class AdminController {

    public async subscriptions({ response }: HttpContextContract) {

        try {

            const subscriptions = await Subscription.query()
                .preload('user')
                .preload('payment')
                .preload('plan')

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Subscriptions fetched successfully",
                data: subscriptions,
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

    public async subscription({ request, response }: HttpContextContract) {
        const id = request.param('id')

        try {

            const subscription = await Subscription.query()
                .preload('user')
                .preload('payment')
                .preload('payments')
                .preload('plan')
                .where('id', id)
                .first()

            if (!subscription) {
                throw new Error('Subscription not found')
            }

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Subscription fetched successfully",
                data: subscription,
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

    public async payments({ response }: HttpContextContract) {

        try {

            const payments = await Payment.query()
                .preload('user')
                .preload('subscription')

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Payments fetched successfully",
                data: payments,
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

    public async payment({ request, response }: HttpContextContract) {
        const id = request.param('id')

        try {

            const payment = await Payment.query()
                .preload('user')
                .preload('subscription')
                .where('id', id)
                .first()

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
