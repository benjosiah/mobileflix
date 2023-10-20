import Env from '@ioc:Adonis/Core/Env'

export const paystack = {
    'secret': Env.get('PAYSTACK_SECRET_KEY'),
    'public': Env.get('PAYSTACK_PUBLIC_KEY'),
    'base_rl': Env.get('BASE_URL')
}