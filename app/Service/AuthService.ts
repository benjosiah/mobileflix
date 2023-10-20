import Hash from '@ioc:Adonis/Core/Hash'
// import auth  from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'
import {RegisterData } from 'App/Interfaces/Auth/AuthInterface'

export default class AuthService {

    public async register(userData: RegisterData) {
        const user = new User()
        user.name = userData.name
        user.email = userData.email
        user.password = await Hash.make(userData.password)
        await user.save()
    }
}