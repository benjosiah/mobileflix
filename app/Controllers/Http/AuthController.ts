import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
// import auth  from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'


export default class AuthController {
    public async register({ request, response }: HttpContextContract) {
        const userData = request.only(['name', 'email', 'password'])
    
        const user = new User()
        user.name = userData.name
        user.email = userData.email
        user.password = await Hash.make(userData.password)
        await user.save()
    
        return response.status(201).json({ message: 'User registered successfully' })
      }
    
      public async login({auth, request, response }: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
    
        // try {
          const token = await auth.use('api').attempt(email, password)
    
          return response.json({ token })
        // } catch {
        //   return response.status(401).json({ message: 'Invalid credentials' })
        // }
      }

}
