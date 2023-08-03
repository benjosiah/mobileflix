import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
// import auth  from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'
import { schema, rules, ValidationException } from '@ioc:Adonis/Core/Validator'


export default class AuthController {
    public async register({ request, response }: HttpContextContract) {

        try{


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
    
      
          return response.status(201).json({ 
            message: 'User registered successfully',
            status: 'success'
          })
        }catch(error){
          if (error instanceof ValidationException) {
            // If the error is a ValidationException, handle validation errors
            return response.status(422).json({
              message: 'Validation failed',
              errors: error
            
            });
          }
      
          console.error('An unexpected error occurred:', error.message);
          return response.status(error.status).json({
            message: error.message ,
            status: 'error'
            });
        }
        
      }
    
      public async login({auth, request, response }: HttpContextContract) {
        const userSchema = schema.create({
          email: schema.string([
            rules.email(),
          ]),
          password: schema.string()
        })
    
        try {
          const payload = await request.validate({ schema: userSchema })
          const token = await auth.use('api').attempt(payload.email, payload.password)
    
          return response.json({ token })
        } catch {
          return response.status(401).json({ message: 'Invalid credentials', staus: "error" })
        }
      }

}
