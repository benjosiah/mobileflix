
interface InitiatePayment{
    amount: number,
    user_id:number,

}

interface CardPayment{
    amount: number,
    user_id:number,
    card_id:number
}

export {InitiatePayment, CardPayment}