
interface InitiatePayment{
    reference: string,
    email: string
    amount: number,
    user_id: number,
    callback_url: string
}

export {InitiatePayment}