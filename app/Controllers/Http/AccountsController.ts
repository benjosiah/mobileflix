import  { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account'
// import User from 'App/Models/User'

export default class AccountsController {
    public async add({ auth, request, response }: HttpContextContract) {
        const userData = request.only(['name'])
        const user_id = auth.user?.id
        if (user_id == null) {
            return
        }
        const account = new Account()
        account.name = userData.name
        account.user_id = user_id
        await account.save()
    
        return response.status(201).json({ message: 'Account Added Successfully' })
    }

    public async index({auth, response }: HttpContextContract) {
        const user_id = auth.user?.id
        
        if (user_id == null) {
            return
        }
        const accounts = await Account.query().where('user_id', user_id)
        return response.status(201).json({ data: accounts})

    }

    public async show({response, params }: HttpContextContract) {
        const id = params.id
        const account = await Account.find(id)

        return response.status(201).json({data: account})
     

    }

    public async edit({request, response, params }: HttpContextContract) {
        const userData = request.only(['name'])
        const id = params.id
    
        const account = await Account.find(id)
        if (account== null) {
            return
        }
        account.name = userData.name
        await account.save()

        return response.status(201).json({ message: 'Account Updated Successfully', data: account })
  
    }
    
}
