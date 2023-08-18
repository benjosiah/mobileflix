import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
// import auth  from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Wallet from 'App/Models/Wallet'


export default class AuthController {
    public async register({ request, response }: HttpContextContract) {

          const userSchema = schema.create({
            name: schema.string([
              rules.required()
            ]),
            email: schema.string([
              rules.email(),
              rules.required(),
              rules.unique({ table: 'users', column: 'email' })
            ]),
            password: schema.string([
              rules.required(),
            ])
          })

          const payload = await request.validate({ schema: userSchema })
        
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
    
      public async login({auth, request, response }: HttpContextContract) {
        const userSchema = schema.create({
          email: schema.string([
            rules.email(),
          ]),
          password: schema.string()
        })
    
        // try {
          const payload = await request.validate({ schema: userSchema })
          const token = await auth.use('api').attempt(payload.email, payload.password)

          const user = await User.query().where('email', payload.email)
            .preload('accounts')
            .preload('wallet')
            .preload('plan')

         
    
          return response.json({ 
            message: "Login successfully",
            data:{user, token },
            starus: "success"
           })
        // } catch {
        //   return response.status(401).json({ message: 'Invalid credentials', staus: "error" })
        // }
      }

}
