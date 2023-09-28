import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
// import auth  from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'
import ResetToken from 'App/Models/ResetToken'
import {rules, schema} from '@ioc:Adonis/Core/Validator'
import Wallet from 'App/Models/Wallet'
import * as crypto from "crypto";
import Mail from '@ioc:Adonis/Addons/Mail'
import {DateTime} from "luxon";
import Env from '@ioc:Adonis/Core/Env'


export default class AuthController {
	public async register({request, response}: HttpContextContract) {

		const userSchema = schema.create({
			name: schema.string([
				rules.required()
			]),
			email: schema.string([
				rules.email(),
				rules.required(),
				// @ts-ignore
				rules.unique({table: 'users', column: 'email'})
			]),
			password: schema.string([
				rules.required(),
			])
		})

		const payload = await request.validate({schema: userSchema})

		const user = new User()
		user.name = payload.name
		user.email = payload.email
		user.password = await Hash.make(payload.password)
		await user.save()

		const wallet = new Wallet
		wallet.user_id = user.id
		wallet.balance = 0
		wallet.save()

		return response.status(201).json({
			message: 'User registered successfully',
			status: 'success'
		})


	}

	public async login({auth, request, response}: HttpContextContract) {
		const userSchema = schema.create({
			email: schema.string([
				rules.email(),
			]),
			password: schema.string()
		})

		// try {
		const payload = await request.validate({schema: userSchema})
		const token = await auth.use('api').attempt(payload.email, payload.password)

		const user = await User.query().where('email', payload.email)
			.preload('accounts')
			.preload('wallet')
			.preload('plan')
			.first()


		return response.json({
			message: "Login successfully",
			data: {user, token},
			status: "success"
		})
		// } catch {
		//   return response.status(401).json({ message: 'Invalid credentials', staus: "error" })
		// }
	}

	public async forgotPassword({request, response}: HttpContextContract) {
		const validateSchema = schema.create({
			email: schema.string([
				rules.email(),
				rules.required(),
			]),
		})

		const redirect_url = request.qs()?.redirect_url

		if (!redirect_url) return response.status(400).json({
			message: 'Redirect url is required',
			status: 'error'
		})

		const payload = await request.validate({schema: validateSchema})

		const user = await User.query().where('email', payload.email).first()

		if (!user) return response.status(404).json({
			message: 'Password reset request rejected: User not found',
			status: 'error'
		})

		const existingToken = await ResetToken.query().where('email', payload.email).first()

		if (existingToken) {
			await existingToken.delete()
		}

		const resetToken = crypto.randomBytes(32).toString("hex")

		const token = new ResetToken()
		token.email = payload.email
		token.token = resetToken
		token.expiresAt = DateTime.now().plus({hours: 2})

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
				.htmlView('emails/reset_password', {
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

	public async verifyResetTokenCallback({request, response, view}: HttpContextContract) {


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


		response.status(302).redirect().toPath(`${redirect_url.split("?")[0]}?token=${reset_token}&email=${checkResetToken?.email}`)

	}

	public async resetPassword({request, response}: HttpContextContract) {
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

		const reset_token = request.qs()?.token

		if (!reset_token) return response.status(400).json({
			message: 'Reset token is required',
			status: 'error'
		})

		const payload = await request.validate({schema: validateSchema})


		const checkResetRequest = await ResetToken.query().where('email', payload?.email).first()


		if (!checkResetRequest || checkResetRequest.token !== reset_token || new Date() > new Date(checkResetRequest?.expiresAt.toString())  ) return response.status(403).json({
			message: 'Password reset rejected: Invalid or expired password reset token',
			status: 'error'
		})

		const user = await User.query().where('email', payload.email).first()

		if (!user) return response.status(404).json({
			message: 'Password reset rejected: User not found',
			status: 'error'
		})

		user.password = await Hash.make(payload.new_password)

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


}

