import Transaction from "App/Models/Transaction"
import { PaystackAxios} from "../../axiosWraper"
import {InitiatePayment, CardPayment} from "../Interfaces/PaymentInterface"
import Card from "App/Models/Card"
// import Wallet from "App/Models/Wallet"

export default class PaymentService {
    public async initiatePayment(payload: InitiatePayment, email: string ){
        const ref = await this.generateUniqueReferenceNumber()
        const body = {
            email: email,
            amount: payload.amount * 100,
            currency: "NGN",
            reference: ref,
            channel: "card"

        }
        const res = await PaystackAxios.post('/transaction/initialize', body)

        const transactions = new Transaction
        transactions.user_id = payload.user_id
        transactions.channel = 'card'
        transactions.purpose = 'add_card'
        transactions.amount = payload.amount
        transactions.reference = ref
        transactions.save()

        return res.data

    }

    public async cardPayment(payload: CardPayment, email: string ){

        const ref = await this.generateUniqueReferenceNumber()
        const card = await Card.find(payload.card_id)
        if(card == null){
            return
        }
        let auth_token = null


		try {
			auth_token = JSON.parse(card.details).authorization_code
		} catch (error) {
			// @ts-ignore
			auth_token = card.details.authorization_code
		}



        // return auth_token
        const body = {
            email: email,
            amount: payload.amount * 100,
            authorization_code: auth_token,
            currency: "NGN",
            reference: ref,

        }

        const res = await PaystackAxios.post('/transaction/charge_authorization', body)

        const transactions = new Transaction
        transactions.user_id = payload.user_id
        transactions.channel = 'card'
        transactions.purpose = "wallet-topup"
        transactions.amount = payload.amount
        transactions.reference = ref
        transactions.status = res.data.data.status
        transactions.details = JSON.stringify(res.data)
        await transactions.save()

        return res.data
    }

    public async verifyPayment(){

    }

    public async generateUniqueReferenceNumber() {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const randomPart = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999

        const referenceNumber = `REF-${timestamp}-${randomPart}`;
        return referenceNumber;
      }


}
