import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import ValidatorMessages from 'Config/validator_messages'

export default class AccountsController {
    public async index({ auth, response }: HttpContextContract) {
        const user = auth.user!
        try {

            const accounts = await user.related('accounts').query()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Accounts fetched successfully",
                data: accounts,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code || "ERR_FETCH_ACCOUNTS",
                message: error.message || "Error fetching accounts",
                data: null,
                user: null,
            })
        }

    }
    public async show({ auth, response, params }: HttpContextContract) {
        const user = auth.user!
        try {

            const account = await user.related('accounts').query().where('id', params.id).firstOrFail()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Account fetched successfully",
                data: account,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code || "ERR_FETCH_ACCOUNT",
                message: error.message || "Error fetching account",
                data: null,
                user: null,
            })
        }

    }
    public async add({ auth, response, request }: HttpContextContract) {
        const user = auth.user!

        //############################# Input Validation #############################
        const userSchema = schema.create({
            name: schema.string([
                rules.required()
            ]),
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

        try {

            const account = await user.related('accounts').create({
                name: request.input('name'),
            })

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Account created successfully",
                data: account,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code || "ERR_CREATE_ACCOUNT",
                message: error.message || "Error creating account",
                data: null,
                user: null,
            })
        }

    }
    public async update({ auth, response, request, params }: HttpContextContract) {
        const user = auth.user!

        try {

            const account = await user.related('accounts').query().where('id', params.id).firstOrFail()


            await account.merge(request.only(['name'])).save()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Account updated successfully",
                data: account,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code || "ERR_UPDATE_ACCOUNT",
                message: error.message || "Error updating account",
                data: null,
                user: null,
            })
        }
    }
    public async delete({ auth, response, params }: HttpContextContract) {
        const user = auth.user!

        try {

            const account = await user.related('accounts').query().where('id', params.id).firstOrFail()

            await account.delete()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Account deleted successfully",
                data: null,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code || "ERR_DELETE_ACCOUNT",
                message: error.message || "Error deleting account",
                data: null,
                user: null,
            })
        }
    }
    public async switch({ auth, response, params }: HttpContextContract) {
        const user = auth.user!

        try {

            
            const account = await user.related('accounts').query().where('id', params.id).first();

            if(!account){
                throw new Error("Account not found")
            }

            user.accountId = account.id
            await user.save()

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Account switched successfully",
                data: account,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code || "ERR_SWITCH_ACCOUNT",
                message: error.message || "Error switching account",
                data: null,
                user: null,
            })
        }
    }
    public async getActiveAccount({ auth, response }: HttpContextContract) {
        const user = auth.user!

        try {

            const account = await user.related('account').query().first()

            if(!account){
                throw new Error("No active account found")
            }

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Active account fetched successfully",
                data: account,
            })

        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code || "ERR_FETCH_ACTIVE_ACCOUNT",
                message: error.message || "Error fetching active account",
                data: null,
                user: null,
            })
        }
    }


}
