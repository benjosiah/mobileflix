import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Plan from 'App/Models/Plan'
import PaymentService from 'App/Service/PaymentService'
import ValidatorMessages from 'Config/validator_messages'
import Env from '@ioc:Adonis/Core/Env'
import Payment from 'App/Models/Payment'

export default class SubscriptionsController {

    public async index({ response, auth }: HttpContextContract) {
        const user = auth.user!

        try {

            await user.load('subscriptions', (query) => {
                query.preload('plan')
                query.preload('payment')

            })

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Subscriptions fetched successfully",
                data: user.subscriptions,
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

            const subscription = await user.related('subscriptions').query()
                .where('id', id)
                .preload('plan')
                .preload('payment')
                .preload('payments')
                .first();

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
                status: "failed",
                code: error.code ?? "ERROR",
                message: error.message ?? "Something went wrong",
                data: null,
            })
        }
    }
    public async getActiveSubscription({ response, auth }: HttpContextContract) {
        const user = auth.user!

        try {

            const subscription = await user.related('subscriptions').query()
                .where('status', 'active')
                .preload('plan')
                .preload('payment')
                .preload('payments')
                .first();

            if (!subscription) {
                throw new Error('Active subscription not found')
            }

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Subscription fetched successfully",
                data: subscription,
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
    public async cancel({ request, response, auth }: HttpContextContract) {
        const user = auth.user!
        const id = request.param('id')

        try {

            const subscription = await user.related('subscriptions').query()
                .where('id', id)
                .preload('plan')
                .preload('payment')
                .preload('payments')
                .first();

            if (!subscription) {
                throw new Error('Subscription not found')
            }

            subscription.status = 'canceled'
            await subscription.save()

            //remove plan from user
            user.planId = null
            await user.save()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Subscription canceled successfully",
                data: subscription,
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
    public async initialize_subscription({ request, response, auth }: HttpContextContract) {
        const user = auth.user!

        //############################# Input Validation #############################
        const userSchema = schema.create({
            //where plan id exists in database
            plan_id: schema.number([
                rules.required(),
                rules.exists({ table: 'plans', column: 'id' })
            ]),
            payment_gateway: schema.enum(['paystack'] as const),
            payment_method: schema.string.optional({ trim: true })
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

        const plan_id = request.input('plan_id');

        try {



            const plan = await Plan.find(plan_id)

            if (!plan) {
                throw new Error('Plan not found')
            }


            //check if user has an active subscription
            const activeSubscription = await user.related('subscriptions').query()
                .where('status', 'active')
                .first();

            if (activeSubscription) {
                throw new Error('You already have an active subscription')
            }


            const paymentGateway = request.input('payment_gateway')

            //generate payment reference
            var paymentReference = "SUB_" + Math.floor(Math.random() * 1000000000) + 1;
            var checkoutUrl = null
            if (paymentGateway == 'paystack') {
                const paystackResponse = await PaymentService.initiatePayment({
                    reference: paymentReference,
                    email: user.email,
                    amount: plan.price,
                    user_id: user.id,
                    callback_url: Env.get('APP_URL') + '/subscriptions/webhook-paystack'
                })

                paymentReference = paystackResponse.data.reference //update payment reference with paystack reference if probabaly changed
                checkoutUrl = paystackResponse.data.authorization_url

                if (!paystackResponse.status) {
                    throw new Error(paystackResponse.message)
                }
            }



            //calculate start date to end date from plan.validityDays for example 10 days
            const startDate = new Date()
            var endDate = new Date()
            endDate.setDate(startDate.getDate() + plan.validityDays)

            //create payment
            const payment = await user.related('payments').create({
                amount: plan.price,
                paymentStatus: 'pending',
                paymentGateway: request.input('payment_gateway'),
                paymentMethod: request.input('payment_method', null),
                description: `Subscription to ${plan.name} plan`,
                reference: paymentReference,
                checkoutUrl: checkoutUrl
            })

            if (!payment) {
                throw new Error('Payment not created')
            }

            //create subscription
            const subscription = await user.related('subscriptions').create({
                planId: plan.id,
                status: 'pending',
                startDate: startDate,
                endDate: endDate,
            })

            if (!subscription) {
                throw new Error('Subscription not created')
            }

            //attach payment to subscription
            subscription.paymentId = payment.id.toString()
            await subscription.save()

            //attach subscription to payment
            payment.subscriptionId = subscription.id
            await payment.save()


            //load payment and plan
            await subscription.load('plan')
            await subscription.load('payment')

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Subscription initialized successfully",
                data: {
                    payment_reference: paymentReference,
                    checkout_url: checkoutUrl,
                    ...subscription.serialize()
                },
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
    public async webhookPaystack({ request, response }: HttpContextContract) {
        // const body = request.all()

        const reference = request.input('reference')

        if (!reference) {
            return response.badRequest({
                status: "failed",
                code: "ERROR",
                message: "Invalid reference",
                data: null,
            })
        }

        try {
            const paystackResponse = await PaymentService.verifyPayment(reference)

            if (paystackResponse.status) {
                //update payment status
                const payment = await Payment.query().where('reference', reference).first()

                if (!payment) {
                    throw new Error('Payment not found')
                }

                payment.paymentStatus = 'success'
                payment.transactionId = paystackResponse.data.trxref
                await payment.save()

                //activate subscription
                const subscription = await payment.related('subscription').query().first()

                if (subscription) {
                    subscription.status = 'active'
                    await subscription.save()
                }

            }




            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Subscription activated successfully",
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
    public async verify_subscription({ request, response, auth }: HttpContextContract) {
        const user = auth.user!
        const id = request.param('id')

        try {

            const subscription = await user.related('subscriptions').query()
                .where('id', id)
                .preload('plan')
                .preload('payment')
                .preload('payments')
                .first();

            if (!subscription) {
                throw new Error('Subscription not found')
            }

            const payment = await subscription.related('payment').query().first()

            if (!payment) {
                throw new Error('Payment not found')
            }

            if (payment.paymentStatus != 'success') {
                throw new Error('Payment not successful')
            }

            //update subscription status
            if (subscription.status != 'active') {
                subscription.status = 'active'
                await subscription.save()
            }


            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Subscription verified successfully",
                data: subscription,
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
