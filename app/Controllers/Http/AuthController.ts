import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import auth  from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import ValidatorMessages from 'Config/validator_messages'
import { string } from '@ioc:Adonis/Core/Helpers'
import MailTemplateVariables from 'Config/mail_template_variables';
import Role from 'App/Models/Role';


export default class AuthController {
	public async register({ request, response, auth }: HttpContextContract) {

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

			const userRole = await Role.query().where('name', 'user').firstOrFail();

			const user = new User()
			user.name = input.name
			user.email = input.email
			user.password = input.password //this will be hashed automatically by the beforeSave hook in the User model
			user.roleId = userRole.id
			user.planId = null //no plan yet (must be set to avoid error when preloading plan relationship at the bottom)
			user.isSubscribed = false //not subscribed yet
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

			// Email verification
			// Generate 6 digit OTP
			const otp = Math.floor(100000 + Math.random() * 900000).toString();
			const verificationToken = await user.related("resetTokens").create({
				token: otp,
				type: "email_verification_otp",
			});

			// Send verification email
			await Mail.send((message) => {
				message
					.from(Env.get('MAIL_FROM')!, string.capitalCase(Env.get('APP_NAME')))
					.to(user.email)
					.subject("Email Verification - " + string.capitalCase(process.env.APP_NAME!))
					.htmlView("emails/verification-otp", {
						...MailTemplateVariables,
						otp: verificationToken.token,
						user: user,
					});
			});

			const token = await auth.use("api").login(user, {
				expiresIn: "90 days",
			});

			await user.load("role");
			await user.load("wallet");
			await user.load("account");
			await user.load("accounts");
			await user.load("plan");


			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: 'Account created successfully',
				data: { token, user }
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

			await user.load('role');
			await user.load('account')
			await user.load('accounts')
			await user.load('wallet')
			await user.load('plan')

			return response.ok({
				status: "success",
				code: "SUCCESS", //
				message: "Login success",
				data: { token, user }
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

	public async resendVerificationEmail({ request, response }: HttpContextContract) {

		//############################# Input Validation #############################
		const userSchema = schema.create({
			email: schema.string([
				rules.email(),
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

		const input = request.all();

		try {
			const user = await User.query().where('email', input.email).first()

			if (!user) {
				throw new Error("Account with this email does not exist");
			}

			//if user email already verified, return error
			if (user.emailVerified) {
				throw new Error("Email already verified");
			}

			// Email verification
			// Generate 6 digit OTP
			const otp = Math.floor(100000 + Math.random() * 900000).toString();
			const verificationToken = await user.related("resetTokens").create({
				token: otp,
				type: "email_verification_otp",
			});

			// Send verification email
			await Mail.send((message) => {
				message
					.from(Env.get('MAIL_FROM')!, string.capitalCase(Env.get('APP_NAME')))
					.to(user.email)
					.subject("Email Verification - " + string.capitalCase(process.env.APP_NAME!))
					.htmlView("emails/verification-otp", {
						...MailTemplateVariables,
						otp: verificationToken.token,
						user: user,
					});
			});

			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: "Email verification email sent successfully",
				data: null
			})

		} catch (error) {
			return response.badRequest({
				status: "failed",
				code: error.code ?? "ERROR",
				message: error.message ?? "An error occurred",
				data: null,
			})
		}

	}

	public async verifyEmail({ request, response }: HttpContextContract) {


		//############################# Input Validation #############################
		const userSchema = schema.create({
			email: schema.string([
				rules.email(),
			]),
			otp: schema.string()
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

		const input = request.all();

		try {
			const user = await User.query().where('email', input.email).firstOrFail();

			const verificationToken = await user.related("resetTokens").query().where('type', 'email_verification_otp').where('token', input.otp).first();

			if (!verificationToken) {
				throw new Error("Invalid OTP");
			}

			//delete the token
			await verificationToken.delete();

			user.emailVerified = true;
			await user.save();

			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: "Email verified successfully",
				data: null
			})

		} catch (error) {
			return response.badRequest({
				status: "failed",
				code: error.code ?? "ERROR",
				message: error.message ?? "Invalid OTP",
				data: null,
			})
		}

	}

	public async profile({ auth, response }: HttpContextContract) {
		const user = auth.user!;

		try {

			await user.load('role');
			await user.load('wallet');
			await user.load('account');
			await user.load('accounts');
			await user.load('plan');

			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: "Profile fetched successfully",
				data: user
			})
		} catch (error) {
			return response.badRequest({
				status: "failed",
				code: error.code ?? "ERROR",
				message: error.message ?? "An error occurred",
				data: null,
			})
		}
	}

	public async logout({ auth, response }: HttpContextContract) {
		try {
			await auth.use("api").logout();

			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: "Logout success",
				data: null
			})
		} catch (error) {
			return response.badRequest({
				status: "failed",
				code: error.code ?? "ERROR",
				message: error.message ?? "An error occurred",
				data: null,
			})
		}
	}

	public async forgotPassword({ request, response }: HttpContextContract) {

		//############################# Input Validation #############################
		const userSchema = schema.create({
			email: schema.string([
				rules.email(),
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

		const input = request.all();

		try {
			const user = await User.query().where('email', input.email).first()

			if (!user) {
				throw new Error("Account with this email does not exist");
			}

			// Generate 6 digit OTP
			const otp = Math.floor(100000 + Math.random() * 900000).toString();
			const resetToken = await user.related("resetTokens").create({
				token: otp,
				type: "password_reset_otp",
			});

			// Send password reset email
			await Mail.send((message) => {
				message
					.from(Env.get('MAIL_FROM')!, string.capitalCase(Env.get('APP_NAME')))
					.to(user.email)
					.subject("Password Reset - " + string.capitalCase(process.env.APP_NAME!))
					.htmlView("emails/password-reset-otp", {
						...MailTemplateVariables,
						otp: resetToken.token,
						user: user,
					});
			});

			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: "Password reset email sent successfully",
				data: null
			})

		} catch (error) {
			return response.badRequest({
				status: "failed",
				code: error.code ?? "ERROR",
				message: error.message ?? "An error occurred",
				data: null,
			})
		}
	}

	public async checkResetPasswordOTP({ request, response }: HttpContextContract) {

		//############################# Input Validation #############################
		const userSchema = schema.create({
			email: schema.string([
				rules.email(),
			]),
			otp: schema.string(),
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

		const input = request.all();

		try {
			const user = await User.query().where('email', input.email).first();

			if (!user) {
				throw new Error("Account with this email does not exist");
			}

			const resetToken = await user.related("resetTokens").query().where('type', 'password_reset_otp').where('token', input.otp).first();

			if (!resetToken) {
				throw new Error("Invalid OTP");
			}

			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: "Valid OTP",
				data: null
			})

		} catch (error) {
			return response.badRequest({
				status: "failed",
				code: error.code ?? "ERROR",
				message: error.message ?? "Invalid OTP",
				data: null,
			})
		}
	}

	public async resetPassword({ request, response }: HttpContextContract) {

		//############################# Input Validation #############################
		const userSchema = schema.create({
			email: schema.string([
				rules.email(),
			]),
			otp: schema.string(),
			password: schema.string(),
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

		const input = request.all();

		try {
			const user = await User.query().where('email', input.email).first();

			if (!user) {
				throw new Error("Account with this email does not exist");
			}

			const resetToken = await user.related("resetTokens").query().where('type', 'password_reset_otp').where('token', input.otp).first();

			if (!resetToken) {
				throw new Error("Invalid OTP");
			}

			//delete the token
			await resetToken.delete();

			user.password = input.password;
			await user.save();

			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: "Password reset successfully",
				data: null
			})

		} catch (error) {
			return response.badRequest({
				status: "failed",
				code: error.code ?? "ERROR",
				message: error.message ?? "Invalid OTP",
				data: null,
			})
		}
	}

	public async updateProfile({ request, response, auth }: HttpContextContract) {
		const user = auth.user!;

		try {

			await user.merge(
				request.only(['name']) //only name can be updated for now
			).save();

			await user.load('role');
			await user.load('wallet');
			await user.load('account');
			await user.load('accounts');
			await user.load('plan');

			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: "Profile updated successfully",
				data: user
			})
		} catch (error) {
			return response.badRequest({
				status: "failed",
				code: error.code ?? "ERROR",
				message: error.message ?? "An error occurred",
				data: null,
			})
		}
	}

	public async changePassword({ request, response, auth }: HttpContextContract) {
		const user = auth.user!;

		//############################# Input Validation #############################
		const userSchema = schema.create({
			old_password: schema.string(),
			new_password: schema.string(),
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

		const input = request.all();

		try {

			await auth.use("api").verifyCredentials(user.email, input.old_password);

			user.password = input.new_password;
			await user.save();

			return response.ok({
				status: "success",
				code: "SUCCESS",
				message: "Password changed successfully",
				data: null
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

