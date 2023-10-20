import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'
import Plan from 'App/Models/Plan'
import Subscription from 'App/Models/Subscription'
import Wallet from 'App/Models/Wallet'
import User from 'App/Models/User'
// import CustomException from 'App/Exceptions/CustomException'
import PaymentService from 'App/Service/PaymentService'
import Card from 'App/Models/Card'
import Transaction from 'App/Models/Transaction'

export default class SubscriptionsController {

	public async GetPlans({response}: HttpContextContract) {
		const plans = await Plan.all()

		return response.status(201).json({message: 'Subscription Plans', status: "success", data: plans})

	}

	public async GetCard({response, auth}: HttpContextContract) {
		const user = auth.user
		if (user === undefined) {

			return response.status(401).json({
				message: 'Unauthorized User access, please login to continue',
				status: "error"
			})
		}
		const cards = await Card.query().where('user_id', user.id)

		cards.forEach(card => {

			try {
				card.details = JSON.parse(card.details)
			} catch (e) {
				//console.log("Error parsing cards value, using as is:", e)
			}

		});

		return response.status(201).json({message: 'User Cards', status: "success", data: cards})

	}

	public async GetWallet({response, auth}: HttpContextContract) {
		const user = auth.user
		if (user == undefined) {
			// throw new CustomException('UnAthorize User access, please login to continue', 401)
			return response.status(401).json({
				message: 'Unauthorized User access, please login to continue',
				status: "error"
			})
		}
		const wallet = await Wallet.findBy('user_id', user.id)

		return response.status(201).json({message: 'Wallet Info', status: "success", data: wallet})

	}

	public async subscribeToPlan({request, response}: HttpContextContract) {
		const subscriptionSchema = schema.create({
			plan_id: schema.number([
				rules.required()
			]),
			user_id: schema.number([
				rules.required()
			]),
		})


		const payload = await request.validate({schema: subscriptionSchema})
		const plan = await Plan.find(payload.plan_id)
		const user = await User.find(payload.user_id)



		if (user === null) {
			// throw new CustomException('User ID does not match any uuser', 404)
			return response.status(422).json({message: 'User ID does not match any uuser', status: "error"})
		}
		if (plan === null) {
			// throw new CustomException('Plan ID does not match any subscription plan', 404)
			return response.status(422).json({message: 'Plan ID does not match any subscription plan', status: "error"})
		}

		const wallet = await Wallet.findBy('user_id', user?.id)

		if (wallet === null) {
			// throw new CustomException('Plan ID does not match any subscription plan', 404)
			return response.status(422).json({message: 'Plan ID does not match any subscription plan', status: "error"})
		}


		if (parseFloat(plan.price) > parseFloat(wallet.balance)) {
			// throw new CustomException('Insufficient funds', 422)
			return response.status(422).json({message: 'Insufficient funds', status: "error"})
		}


		const subscription = new Subscription
		subscription.user_id = user.id
		subscription.plan_id = payload.plan_id

		if (await subscription.save()) {
			user.is_subscribed = true
			user.plan_id = payload.plan_id
			user.save()

			wallet.balance = parseFloat(wallet.balance) - parseFloat(plan.price)
			wallet.save()

		}

		return response.status(201).json({message: 'Subscription successful', status: "success", data: subscription})


	}

	public async topUPWallet({request, response, auth}: HttpContextContract) {
		const walletSchema = schema.create({
			amount: schema.number([
				rules.required()
			]),

			user_id: schema.number([
				rules.required()
			]),

			card_id: schema.number([
				rules.required()
			]),
		})

		const user = auth.user


		const payload = await request.validate({schema: walletSchema})

		if (user == undefined) {
			// throw new CustomException('UnAthorize User access, please login to continue', 401)
			return response.status(401).json({
				message: 'Unauthorized User access, please login to continue',
				status: "error"
			})
		}

		if (user.id !== payload.user_id) {
			// throw new CustomException('User ID not the same as Authenticated User', 422)
			return response.status(422).json({message: 'User ID does not match Authenticated User', status: "error"})
		}
		let wallet = await Wallet.findBy('user_id', user.id)
		if (wallet == null) {
			return
		}

		const payment = new PaymentService
		const res = await payment.cardPayment(payload, user.email)

		if (!res) return response.status(422).json({
			message: 'An error occurred while processing payment. Try using another card',
			status: "error"
		})


		if (res?.data && res?.data?.status == "success") {
			wallet.balance = parseFloat(wallet.balance) + payload.amount
			await wallet.save()
		}


		return response.status(201).json({message: 'Wallet Top-Up Successful', status: "success", data: wallet})


	}

	public async addCard({request, response, auth}: HttpContextContract) {
		const CardSchema = schema.create({
			charge_amount: schema.number([]),
			user_id: schema.number([
				rules.required()
			]),

		})

		const payload = await request.validate({schema: CardSchema})

		const user = auth.user

		if (user == undefined) {
			// throw new CustomException('UnAthorize User access, please login to continue', 401)
			return response.status(401).json({
				message: 'Unauthorized User access, please login to continue',
				status: "error"
			})
		}

		if (user.id !== payload.user_id) {
			// throw new CustomException('User ID not the same as Authenticated User', 422)
			return response.status(422).json({
				message: 'Provided user ID does not match Authenticated User',
				status: "error"
			})
		}

		const payment = new PaymentService
		const res = await payment.initiatePayment({...payload, amount: payload.charge_amount || 100}, user.email)

		return response.status(201).json({message: 'Card added Successfully', status: "success", data: res})
	}

	public async removeCard({request, response, auth}: HttpContextContract) {
		const Schema = schema.create({
			user_id: schema.number([
				rules.required()
			]),
		})

		const payload = await request.validate({schema: Schema})


		const user = auth.user
		if (user === undefined) {

			return response.status(401).json({
				message: 'Unauthorized User access, please login to continue',
				status: "error"
			})
		}


		if (user.id !== payload.user_id) {
			return response.status(403).json({
				message: 'Unauthorized action, provided user does not match authenticated user',
				status: "error"
			})
		}



		const cards = await Card.query().where('user_id', user.id)
		for (const card of cards) {
			await card.delete()
		}

		return response.status(201).json({message: 'Cards removed Successfully', status: "success"})


	}

	public async verifyPayments({request, response}: HttpContextContract) {

		console.log("webhook called")

		const body = request.all()

		// return body.data.authorization
		const transaction = await Transaction.findBy('reference', body.data.reference)


		if (transaction == null) {
			return
		}

		const wallet = await Wallet.findBy('user_id', transaction.user_id)

		if (wallet == null) {
			return
		}

		if (body.data.status == "success") {
			// return "bbb"
			if (body.data.channel === "card") {

				//logic to overwrite card details
				const card = await Card.findBy('user_id', transaction.user_id)
				if (card) {
					card.details = JSON.stringify(body.data.authorization)
					await card.save()
				} else {
					const card = new Card
					card.user_id = transaction.user_id
					card.details = JSON.stringify(body.data.authorization)
					await card.save()
				}

			}

			wallet.balance = parseFloat(wallet.balance) + parseFloat(transaction.amount)
			await wallet.save()

			transaction.status = body.data.status
			transaction.details = JSON.stringify(body.data)
			await transaction.save()
		} else {
			transaction.status = body.data.status
			transaction.details = JSON.stringify(body.data)
			await transaction.save()
		}

		return response.status(201).json({message: 'Data Received', status: "success"})


	}

	public async GetTransactions({response, auth}: HttpContextContract) {

		const user = auth.user

		if (user == undefined) {
			return response.status(401).json({
				message: 'Unauthorized User access, please login to continue',
				status: "error"
			})
		}

		const transactions = await Transaction.query().where('user_id', user.id)

		return response.status(201).json({message: 'Transactions', status: "success", data: transactions})
	}


}
