/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import  { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation except
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).json({
        message: 'Validation failed',
        errors: error.messages,
        status: "error",
      })
    }

    else if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return ctx.response.status(403).json({
        message: 'Authorization faild',
        errors: error.message,
        status: "error",
      })
    }



    else if(error.errors.statusCode == 500){
      if(process.env.NODE_ENV == "development"){
        return ctx.response.status(500).json({
          message: error.code,
          errors: error,
          status: "error",
        })
      }else{
        return ctx.response.status(500).json({
          message: "something went wrong",
          status: "error",
        })
      }
    }

    // else{
    //   return ctx.response.status(500).json({
    //     message: error.code,
    //     errors: error,
    //     status: "error",
    //   })
    // }


    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)

  }
}
