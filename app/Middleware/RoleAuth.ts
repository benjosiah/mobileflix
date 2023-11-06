import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class RoleAuth {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void> , roles: string[]) {
    
    //get user
    const user = auth.user! as User
    await user.load('role')

    //check if user is equal to the role
    if(!roles.includes(user.role.name)) {
      return response.unauthorized({
        status: "unauthorized",
        code: "E_UNAUTHORIZED_ACCESS",
        message: "Unauthorized access. Only " + roles.join(", ") + " can access this route",
        data: null
      })
    }


    await next()
  }
}
