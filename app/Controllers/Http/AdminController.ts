import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Payment from 'App/Models/Payment'
import Subscription from 'App/Models/Subscription'
import User from 'App/Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import ValidatorMessages from 'Config/validator_messages'
import Role from 'App/Models/Role'

export default class AdminController {

    // SUBSCRIPTIONS
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
    public async verify_subscription({ request, response }: HttpContextContract) {
        const id = request.param('id')

        try {

            const subscription = await Subscription.query()
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

            //if subscription is not yet expired
            if (subscription.endDate < new Date()) {
                throw new Error('Subscription already expired')
            }


            //activate subscription
            subscription.status = 'active'
            await subscription.save()

            //update user plan
            await subscription.load('user')
            const user = subscription.user

            user.planId = subscription.planId
            user.isSubscribed = true
            await user.save()


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
    public async cancel_subscription({ request, response }: HttpContextContract) {
        const id = request.param('id')

        try {

            const subscription = await Subscription.query()
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

            //if payment is pending, cancel it
            const payment = subscription.payment
            if (payment) {
                if (payment.paymentStatus == 'pending') {
                    payment.paymentStatus = 'canceled'
                    await payment.save()
                }
            }

            await subscription.load('payment') //reload updated payment
            await subscription.load('payments')

            //remove plan from user
            await subscription.load('user')
            const user = subscription.user
            user.planId = null
            user.isSubscribed = false
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


    // PAYMENTS
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
    public async verify_payment({ request, response }: HttpContextContract) {
        const id = request.param('id')

        try {

            const payment = await Payment.query()
                .where('id', id)
                .preload('subscription')
                .first();

            if (!payment) {
                throw new Error('Payment not found')
            }

            if (payment.paymentStatus != 'success') {
                throw new Error('Payment not successful')
            }

            //if subscription is not yet expired
            if (payment.subscription.endDate < new Date()) {
                throw new Error('Subscription already expired')
            }

            //activate subscription
            payment.subscription.status = 'active'
            await payment.subscription.save()

            //update user plan
            await payment.subscription.load('user')
            const user = payment.subscription.user

            user.planId = payment.subscription.planId
            user.isSubscribed = true
            await user.save()

            await payment.load('subscription') //reload subscription

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Payment verified successfully",
                data: payment,
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
    public async cancel_payment({ request, response }: HttpContextContract) {
        const id = request.param('id')

        try {

            const payment = await Payment.query()
                .where('id', id)
                .preload('subscription')
                .first();

            if (!payment) {
                throw new Error('Payment not found')
            }

            //cancel payment
            payment.paymentStatus = 'canceled'
            await payment.save()

            payment.subscription.status = 'canceled'
            await payment.subscription.save()

            //remove plan from user
            await payment.subscription.load('user')
            const user = payment.subscription.user
            user.planId = null
            user.isSubscribed = false
            await user.save()

            await payment.load('subscription') //reload updated subscription

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Payment canceled successfully",
                data: payment,
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


    // USERS
    public async users({ response }: HttpContextContract) {

        try {

            const users = await User.query()
                .preload('plan')

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Users fetched successfully",
                data: users,
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
    public async user({ request, response }: HttpContextContract) {
        const id = request.param('id')

        try {

            const user = await User.query()
                .preload('plan')
                .preload('role')
                .preload('subscriptions')
                .preload('payments')
                .where('id', id)
                .first()

            if (!user) {
                throw new Error('User not found')
            }

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "User fetched successfully",
                data: user,
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
    public async update_user({ request, response, auth }: HttpContextContract) {
        const admin = auth.user!
        await admin.load('role')

        const id = request.param('id')

        try {

            const user = await User.query()
                .where('id', id)
                .preload('plan')
                .preload('role')
                .preload('subscriptions')
                .preload('payments')
                .first()

            if (!user) {
                throw new Error('User not found')
            }

            //super admin can't be updated
            if (user.role.name == 'super-admin') {
                throw new Error('Super Admin can\'t be updated')
            }

            //only super admin can update admin
            if (user.role.name == 'admin' && admin.role.name != 'super-admin') {
                throw new Error('Only Super Admin can update Admin')
            }

            await user.merge(request.only([
                'name',
                'email',
                'role_id',
                'is_subscribed',
                'plan_id',
                'email_verified',
            ])).save()

            //reload
            await user.load('plan')
            await user.load('role')

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "User updated successfully",
                data: user,
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
    public async delete_user({ request, response, auth }: HttpContextContract) {
        const admin = auth.user!
        await admin.load('role')

        const id = request.param('id')

        try {

            const user = await User.query()
                .where('id', id)
                .preload('plan')
                .preload('role')
                .first()

            if (!user) {
                throw new Error('User not found')
            }

            //super admin can't be deleted
            if (user.role.name == 'super-admin') {
                throw new Error('Super Admin can\'t be deleted')
            }

            //only super admin can delete admin
            if (user.role.name == 'admin' && admin.role.name != 'super-admin') {
                throw new Error('Only Super Admin can delete Admin')
            }

            await user.delete()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "User deleted successfully",
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
    public async add_user({ request, response, auth }: HttpContextContract) {
        const admin = auth.user!
        await admin.load('role')

        //############################# Input Validation #############################
        const userSchema = schema.create({
            name: schema.string([
                rules.required()
            ]),
            email: schema.string([
                rules.email(),
                rules.required(),
                // @ts-ignore
                rules.unique({ table: 'users', column: 'email' })
            ]),
            password: schema.string([
                rules.required(),
            ]),
            role: schema.enum.optional(['user', 'admin', 'publisher'] as const),
        })
        // Re-format exception as a proper resonse for the Frontend Developer
        //always use try catch block to catch any error that may occur while validating user input, front-end developers won't undertsand exceptions
        try {
            await request.validate({ schema: userSchema, messages: ValidatorMessages }) //@seunoyeniyi: I added messages for end user friendly error messages
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

        try { //try catch block to catch any error that may occur while registering user

            const role = await Role.query().where('name', input.role || 'user').first()

            if (!role) {
                throw new Error('Role not found')
            }

            //only super admin can create admin
            if (role.name == 'admin' && admin.role.name != 'super-admin') {
                throw new Error('Only Super Admin can create Admin')
            }

            const user = new User()
            user.name = input.name
            user.email = input.email
            user.password = input.password //this will be hashed automatically by the beforeSave hook in the User model
            user.roleId = role.id
            user.planId = null //no plan yet (must be set to avoid error when preloading plan relationship at the bottom)
            user.isSubscribed = false //not subscribed yet
            user.emailVerified = true //since we are creating the user ourselves, we can assume the email is verified
            await user.save()

            if (!user.$isPersisted) {
                return response.badRequest({
                    code: "ERROR",
                    message: "Unable to create account",
                    data: null
                })
            }

            await user.related("wallet").create({});

            //create default account (watching account)
            const defaultAccount = await user.related("accounts").create({
                name: user.name
            });

            user.accountId = defaultAccount.id;
            await user.save();

            await user.load("role");
            await user.load("wallet");
            await user.load("account");
            await user.load("accounts");
            await user.load("plan");


            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: 'Account created successfully',
                data: user,
            })
        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code,
                message: error.message,
                data: null
            })


        }
    }

}
