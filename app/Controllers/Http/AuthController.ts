import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import auth  from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'
import ResetToken from 'App/Models/ResetToken'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Wallet from 'App/Models/Wallet'
import * as crypto from "crypto";
import Mail from '@ioc:Adonis/Addons/Mail'
import { DateTime } from "luxon";
import Env from '@ioc:Adonis/Core/Env'
import ValidatorMessages from 'Config/validator_messages'


export default class AuthController {
	public async register({ request, response }: HttpContextContract) {

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
			])
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
			const user = new User()
			user.name = input.name
			user.email = input.email
			user.password = input.password //this will be hashed automatically by the beforeSave hook in the User model
			await user.save()

			const wallet = new Wallet
			wallet.user_id = user.id
			wallet.balance = 0
			wallet.save()

			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: 'User registered successfully',
				data: user,
			})
		} catch (error) {
			return response.badRequest({
				status: "failed",
				code: error.code,
				message: error.message,
				data: null,
			})


		}
	}

	public async login({ auth, request, response }: HttpContextContract) {

		//############################# Input Validation #############################
		const userSchema = schema.create({
			email: schema.string([
				rules.email(),
			]),
			password: schema.string()
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
		//#############################End Input Validation #############################






		const input = request.all();

		try {
			const token = await auth.use("api").attempt(input.email, input.password);

			const user = token.user;

			await user.load('accounts')
			await user.load('wallet')
			await user.load('plan')

			return response.ok({
				status: "success",
				code: "SUCCESS", //
				message: "Login success",
				data: { user, token }
			})

		} catch (error) {
			return response.unauthorized({
				status: "failed",
				code: error?.code ?? "E_UNAUTHORIZED_ACCESS",
				message: "Invalid credentials",
				data: null
			})
		}



	}


	/**
	 * @seunoyeniyi to @jesulonimii
	 * 
	 * @note I've reviewed and corrected the above code.... Remain below.
	 * @jesulonimii If you've already reviewed and confirmed the below code, you can move it up and delete this note
	 * @Note Make sure, they return proper response format for frond end developer... I hate issues with co-front-end-developers
	 * 
	 * I'm moving to MoviesController
	 */





	public async forgotPassword({ request, response }: HttpContextContract) {
		const validateSchema = schema.create({
			email: schema.string([
				rules.email(),
				rules.required(),
			]),
		})

		const redirect_url = request.qs()?.redirect_url
		const method: "otp" | "token" = request.qs()?.type?.toLowerCase() ?? 'otp'

		if (method !== 'otp' && method !== 'token') return response.status(400).json({
			message: 'Method value can only be "otp" or "token"',
			status: 'error'
		})

		if (method === 'token' && !redirect_url) return response.status(400).json({
			message: 'Redirect url is required',
			status: 'error'
		})


		const payload = await request.validate({ schema: validateSchema })

		const user = await User.query().where('email', payload.email).first()

		if (!user) return response.status(404).json({
			message: 'Password reset request rejected: User not found',
			status: 'error'
		})

		const existingToken = await ResetToken.query().where('email', payload.email).first()

		if (existingToken) {
			await existingToken.delete()
		}


		if (method === 'otp') {
			const resetOTP = Math.floor(Math.random() * 10000).toString()

			const token = new ResetToken()
			token.email = payload.email
			token.token = resetOTP
			token.expiresAt = DateTime.now().plus({ minutes: 15 })

			await token.save()

			const result = await Mail.send((message) => {
				message
					.from('noreply@cinemoapp.com', 'Cinemo')
					.to(payload?.email)
					.subject('Cinemo Password Reset Request')
					.text(`
					Hello ${user?.name},
					You recently requested to reset your password for your Cinemo account.
					Your OTP is: ${resetOTP},
					This OTP is only valid for the next 15 minutes. If you did not request a password reset, please ignore this email.
					Thanks, Cinemo Team.
				`)
					.htmlView('emails/reset_password_otp', {
						name: user?.name,
						otp: resetOTP,
					})
			})

			if (result) {
				return response.json({
					message: 'Reset password link has been sent to provided email',
					status: 'success'
				})
			}
			else {
				return response.status(500).json({
					message: 'An error occurred while sending reset password link to provided email',
					status: 'error'
				})
			}
		}
		else if (method === 'token') {
			const resetToken = crypto.randomBytes(32).toString("hex")

			const token = new ResetToken()
			token.email = payload.email
			token.token = resetToken
			token.expiresAt = DateTime.now().plus({ hours: 2 })

			await token.save()

			const callbackUrl = `${Env.get('API_URL')}/verify-reset-token?token=${resetToken}&redirect_url=${redirect_url}`

			const result = await Mail.send((message) => {
				message
					.from('noreply@cinemoapp.com', 'Cinemo')
					.to(payload?.email)
					.subject('Cinemo Password Reset Request')
					.text(`
					Hello ${user?.name},
					You recently requested to reset your password for your Cinemo account. Use the link below to reset it.
					Link: ${callbackUrl},
					This password reset is only valid for the next 24 hours. If you did not request a password reset, please ignore this email.
					Thanks, Cinemo Team.
				`)
					.htmlView('emails/reset_password_token', {
						name: user?.name,
						action_url: callbackUrl,
					})
			})

			if (result) {
				return response.json({
					message: 'Reset password link has been sent to provided email',
					status: 'success'
				})
			}
			else {
				return response.status(500).json({
					message: 'An error occurred while sending reset password link to provided email',
					status: 'error'
				})
			}
		}



	}

	public async verifyResetOTP({ request, response }: HttpContextContract) {

		const validateSchema = schema.create({
			email: schema.string([
				rules.email(),
				rules.required(),
			]),
			otp: schema.string([
				rules.required(),
				rules.maxLength(4)
			]),
		})

		const payload = await request.validate({ schema: validateSchema })



		const checkOTP = await ResetToken.query().where('token', payload?.otp).first()


		if (!checkOTP || new Date() > new Date(checkOTP?.expiresAt.toString()) || checkOTP?.email !== payload?.email) {

			return response.status(403).json({
				message: 'Invalid or expired reset OTP.',
				status: 'error'
			})

		}

		return response.status(200).json({
			message: 'OTP confirmed successfully',
			status: 'success'
		})

	}

	public async verifyResetTokenCallback({ request, response, view }: HttpContextContract) {


		const reset_token = request.qs()?.token
		const redirect_url = request.qs()?.redirect_url

		if (!reset_token) return response.status(400).json({
			message: 'Reset token is required',
			status: 'error'
		})

		const checkResetToken = await ResetToken.query().where('token', reset_token).first()


		if (!checkResetToken || new Date() > new Date(checkResetToken?.expiresAt.toString())) {

			return await view.render('general/password-reset-failed', {
				reason: 'Invalid or expired reset token.',
				advice: 'Please try requesting  password reset again',
			})

		}

		return await view.render('general/redirect', {
			url: `${redirect_url.split("?")[0]}?token=${reset_token}&email=${checkResetToken?.email}`
		})


		//response.status(302).redirect().toPath(`${redirect_url.split("?")[0]}?token=${reset_token}&email=${checkResetToken?.email}`)

	}

	public async resetPassword({ request, response }: HttpContextContract) {
		const validateSchema = schema.create({
			new_password: schema.string([
				rules.required(),
				rules.minLength(6),
			]),
			email: schema.string([
				rules.email(),
				rules.required(),
			]),
		})

		const reset_token = request.qs()?.token ?? request.qs()?.otp

		if (!reset_token) return response.status(400).json({
			message: 'Reset token/OTP is required',
			status: 'error'
		})

		const payload = await request.validate({ schema: validateSchema })


		const checkResetRequest = await ResetToken.query().where('email', payload?.email).first()


		if (!checkResetRequest || checkResetRequest.token !== reset_token || new Date() > new Date(checkResetRequest?.expiresAt.toString())) return response.status(403).json({
			message: 'Password reset rejected: Invalid or expired password reset token/OTP',
			status: 'error'
		})

		const user = await User.query().where('email', payload.email).first()

		if (!user) return response.status(404).json({
			message: 'Password reset rejected: User not found',
			status: 'error'
		})

		user.password = payload.new_password

		if (await user.save()) {

			await checkResetRequest.delete()
			return response.json({
				message: 'Password reset successfully',
				status: 'success'
			})

		}

		else return response.status(500).json({
			message: 'An error occurred while resetting password',
			status: 'error'
		})

	}

	public async GetUserInfo({ auth, response }: HttpContextContract) {

		const user = auth.user

		if (!auth || !user) return response.status(401).json({
			message: 'Unauthorized User access, please login to continue',
			status: "error"
		})

		await user?.load('wallet')
		await user?.load('accounts')
		await user?.load('plan')


		return response.json({
			message: 'User info retrieved successfully',
			status: 'success',
			data: user
		})


		//

	}

}

