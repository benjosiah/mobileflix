import  { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpException } from '@adonisjs/generic-exceptions';
import Account from 'App/Models/Account'
import { schema, rules, ValidationException } from '@ioc:Adonis/Core/Validator'
// import User from 'App/Models/User'

export default class AccountsController {
    public async add({ auth, request, response }: HttpContextContract) {
        try{
            const userSchema = schema.create({
                name: schema.string([
                  rules.required()
                ])
              })

              const payload = await request.validate({ schema: userSchema })
            const user_id = auth.user?.id
            if (user_id == null) {
                return
            }
            const account = new Account()
            account.name = payload.name
            account.user_id = user_id
            await account.save()
        
            return response.status(201).json({ message: 'Account Added Successfully', status: "success" })
        }catch(error){
            if (error instanceof ValidationException) {
                // If the error is a ValidationException, handle validation errors
                return response.status(422).json({
                  message: 'Validation failed',
                  errors: error.messages
                
                });
            }
            console.error('An unexpected error occurred:', error.message);
            return response.status(error.status).json({
                message: error.message ,
                status: 'error'
                });
        }

    }

    public async index({auth, response }: HttpContextContract) {
        try{
            const user_id = auth.user?.id
            
            if (user_id == null) {
                return
            }
            const accounts = await Account.query().where('user_id', user_id)
            return response.status(201).json({message:"All User's Accounts", data: accounts, status: "success"})
        }catch(error){
            console.error('An unexpected error occurred:', error.message);
            return response.status(error.status).json({
                message: error.message ,
                status: 'error'
                });
        }

    }

    public async show({response, params }: HttpContextContract) {
        try{
            const id = params.id
            const account = await Account.find(id)
            if (account== null) {
                throw new HttpException('Account not found', 404);
            }
            return response.status(201).json({message: "Account Record", data: account, status: "success"})
        }catch(error){
            console.error('An unexpected error occurred:', error.message);
            return response.status(error.status).json({
                message: error.message ,
                status: 'error'
                });
        }

     

    }

    public async edit({request, response, params }: HttpContextContract) {
        try{
            const userSchema = schema.create({
                name: schema.string([
                  rules.required()
                ]),
              })

              const payload = await request.validate({ schema: userSchema })
            const id = params.id
        
            const account = await Account.find(id)
            if (account== null) {
                throw new HttpException('Account not found', 404);
            }
            account.name = payload.name
            await account.save()

            return response.status(201).json({ message: 'Account Updated Successfully', data: account, status: "success" })
        }catch(error){
            if (error instanceof ValidationException) {
                // If the error is a ValidationException, handle validation errors
                return response.status(422).json({
                  message: 'Validation failed',
                  errors: error.messages
                
                });
            }
            console.error('An unexpected error occurred:', error.message);
            return response.status(error.status).json({
            message: error.message ,
            status: 'error'
            });
        }
  
    }
    
}
