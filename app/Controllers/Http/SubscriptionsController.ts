import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Plan from 'App/Models/Plan'
import Subscription from 'App/Models/Subscription'
import Wallet from 'App/Models/Wallet'
import User from 'App/Models/User'
// import CustomException from 'App/Exceptions/CustomException'
import PaymentService from 'App/Service/PaymentService'
import Card from 'App/Models/Card'
import Transaction from 'App/Models/Transaction'
export default class SubscriptionsController {

    public async GetPlans({response }: HttpContextContract) {
        const plans = await Plan.all()

        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: plans })
        
    }

    public async GetCard({response, auth }: HttpContextContract) {
        const user = auth.user
        if(user == undefined){

            return response.status(401).json({message: 'UnAthorize User access, please login to continue', status: "error"})
        }
        const cards = await Card.query().where('user_id', user.id)

        cards.forEach(card => {
            card.details = JSON.parse(card.details)
        });

        
        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: cards })
        
    }

    public async GetWallet({response, auth }: HttpContextContract) {
        const user = auth.user
        if(user == undefined){
            // throw new CustomException('UnAthorize User access, please login to continue', 401)
            return response.status(401).json({message: 'UnAthorize User access, please login to continue', status: "error"})
        }
        const wallet = await Wallet.findBy('user_id', user.id)
        
        return response.status(201).json({ message: 'Subscription Plans', status: "success", data: wallet })
        
    }

    public async subcribeTOPlan({request, response}: HttpContextContract) {
        const subscriptionSchema = schema.create({
            plan_id: schema.number([
                rules.required()
            ]),
            user_id: schema.number([
                rules.required()
            ]),
        })

        
            
            const payload = await request.validate({ schema: subscriptionSchema })
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

            if(parseFloat(plan.price) > parseFloat(wallet.balance)){
                // throw new CustomException('Insufficient funds', 422)
                return response.status(422).json({message: 'Insufficient funds', status: "error"})
            }


            const subscription  = new Subscription
            subscription.user_id = user.id
            subscription.plan_id = payload.plan_id
            
            if(await subscription.save()){
                user.is_subscribed =true
                user.save()

                wallet.balance = parseFloat(wallet.balance) - parseFloat(plan.price)
                wallet.save()

            }
            
            return response.status(201).json({ message: 'subscription Successful', status: "success", data: subscription })


    }

    public async topUPWallet({request, response,  auth}: HttpContextContract) {
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


            const payload = await request.validate({ schema: walletSchema })

            if(user == undefined){
                // throw new CustomException('UnAthorize User access, please login to continue', 401)
                return response.status(401).json({message: 'UnAthorize User access, please login to continue', status: "error"})
            }
    
            if (user.id !== payload.user_id ) {
                // throw new CustomException('User ID not the same as Authenticated User', 422)
                return response.status(422).json({message: 'User ID not the same as Authenticated User', status: "error"})
            }
            let wallet  =  await Wallet.findBy('user_id', user.id)
            if(wallet == null){
                return
            }

            const payment = new PaymentService
            const res = await payment.cardPayment(payload, user.email)
            
            if(res.data.status == "success"){
                wallet.balance = parseFloat(wallet.balance) + payload.amount
                await wallet.save()
            }
            
            
            return response.status(201).json({ message: 'Wallet topUp Successfully', status: "success", data: wallet })


    }

    public async addCard({request, response,  auth}: HttpContextContract){
        const CardSchema = schema.create({
            amount: schema.number([
                rules.required()
            ]),
            user_id: schema.number([
                rules.required()
            ]),

        })

        const payload = await request.validate({ schema: CardSchema })

        const user = auth.user

        if(user == undefined){
            // throw new CustomException('UnAthorize User access, please login to continue', 401)
            return response.status(401).json({message: 'UnAthorize User access, please login to continue', status: "error"})
        }

        if (user.id !== payload.user_id ) {
            // throw new CustomException('User ID not the same as Authenticated User', 422)
            return response.status(422).json({message: 'User ID not the same as Authenticated User', status: "error"})
        }

        const payment = new PaymentService
        const res = await payment.initiatePayment(payload, user.email)

        return response.status(201).json({ message: 'Wallet topUp Successfully', status: "success", data: res })
    }

    public async verifyPayments({request, response}: HttpContextContract){

        const body = request.all()
     
        // return body.data.authorization
        const transaction = await Transaction.findBy('reference', body.data.reference)
        
            
        if(transaction == null){
            return 
        }

        const wallet = await Wallet.findBy('user_id', transaction.user_id)

        if(wallet == null){
            return 
        }

        if(body.data.status == "success" ){
            // return "bbb"
            if(body.data.channel === "card"){
                const card = new Card
                card.user_id = transaction.user_id
                card.details = JSON.stringify(body.data.authorization)
                await card.save()
            }

            wallet.balance = parseFloat(wallet.balance) + parseFloat(transaction.amount)
            await wallet.save()

            transaction.status = body.data.status
            transaction.details = JSON.stringify(body.data)
            await transaction.save()
        }else{
            transaction.status = body.data.status
            transaction.details = JSON.stringify(body.data)
            await transaction.save()
        }

        return response.status(201).json({ message: 'Data Recieved', status: "success" })


    }



}
   