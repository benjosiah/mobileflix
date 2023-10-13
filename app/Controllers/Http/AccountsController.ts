import  { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpException } from '@adonisjs/generic-exceptions';
import Account from 'App/Models/Account'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import User from 'App/Models/User'

export default class AccountsController {
    public async add({ auth, request, response }: HttpContextContract) {

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


    }

    public async index({auth, response }: HttpContextContract) {

            const user_id = auth.user?.id

            if (user_id == null) {
                return
            }
            const accounts = await Account.query().where('user_id', user_id)
            return response.status(201).json({message:"All User's Accounts", data: accounts, status: "success"})


    }

    public async show({response, params }: HttpContextContract) {

            const id = params.id
            const account = await Account.find(id)
            if (account== null) {
                throw new HttpException('Account not found', 404);
            }
            return response.status(201).json({message: "Account Record", data: account, status: "success"})



    }

    public async edit({request, response, params }: HttpContextContract) {

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


    }

}
