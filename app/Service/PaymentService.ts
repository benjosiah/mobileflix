import { PaystackAxios } from "../../axiosWraper"
import { InitiatePayment } from "../Interfaces/PaymentInterface"


export default class PaymentService {
    public static async initiatePayment(payload: InitiatePayment) {
        const body = {
            email: payload.email,
            amount: payload.amount * 100, // convert to kobo
            currency: "NGN",
            reference: payload.reference,
            callback_url: payload.callback_url,
        }

        try {
            const res = await PaystackAxios.post('/transaction/initialize', body)
            return res.data
        } catch (error) {
            console.log(error)
            return {
                status: error.status ?? "error",
                message: error.message ?? "Something went wrong",
                data: null
            };
        }

    }

    public static async verifyPayment(reference: string) {
        try {
            const res = await PaystackAxios.get('/transaction/verify/' + reference)
            return res.data;
        } catch (error) {
            console.log(error)
            return {
                status: error.status ?? "error",
                message: error.message ?? "Something went wrong",
                data: null
            }
        }
    }

}
