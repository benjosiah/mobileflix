/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
/*import AutoSwagger from "adonis-autoswagger";
import swagger from "Config/swagger";*/

Route.get('/', async () => {
  return { hello: 'world' }
})

// returns swagger in YAML
/*Route.get("/swagger", async () => {
	// @ts-ignore
	return AutoSwagger.docs(Route.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
Route.get("/docs", async () => {
	return AutoSwagger.ui("/swagger");
});*/

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.post('/forgot-password', 'AuthController.forgotPassword')
Route.post('/reset-password', 'AuthController.resetPassword')
Route.post('/verify-reset-otp', 'AuthController.verifyResetOTP')
Route.get('/verify-reset-token', 'AuthController.verifyResetTokenCallback')


Route.post('/verify-payment', 'SubscriptionsController.verifyPayments')
Route.get('/plans', 'SubscriptionsController.GetPlans')


Route.group(()=>{
  Route.post('/accounts', 'AccountsController.add')
  Route.get('accounts', 'AccountsController.index')
  Route.get('/accounts/:id', 'AccountsController.show')
  Route.patch('/accounts/:id', 'AccountsController.edit')


  Route.post('/subscribe', 'SubscriptionsController.subscribeToPlan')
  Route.get('/cards', 'SubscriptionsController.GetCard')
  Route.post('add-card', 'SubscriptionsController.addCard')
  Route.post('/topup-wallet', 'SubscriptionsController.topUPWallet')
  Route.get('/wallet', 'SubscriptionsController.GetWallet')
  Route.get('/transactions', 'SubscriptionsController.GetTransactions')








}).prefix('users').middleware('auth')

Route.group(()=>{
  Route.get('/', 'MoviesController.GetAllMovies')
  Route.get('/series', 'MoviesController.GetAllShow')
  Route.get('/clips', 'MoviesController.GetClips')
  Route.get('/:id', 'MoviesController.GetMovie')
}).prefix('movies')

Route.group(()=>{
  Route.group(()=>{
    
  })
}).prefix('admin')

