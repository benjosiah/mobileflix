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


// AUTHENTICATION
Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.post('/forgot-password', 'AuthController.forgotPassword')
Route.post('/reset-password', 'AuthController.resetPassword')
Route.post('/verify-reset-otp', 'AuthController.verifyResetOTP')
Route.get('/verify-reset-token', 'AuthController.verifyResetTokenCallback')

// PAYMENT AND SUBSCRIPTION
Route.post('/verify-payment', 'SubscriptionsController.verifyPayments') //paystack webhook
Route.get('/plans', 'SubscriptionsController.GetPlans')



// AUTHENTICATED
Route.group(() => {
	Route.post('/accounts', 'AccountsController.add')
	Route.get('accounts', 'AccountsController.index')
	Route.get('/accounts/:id', 'AccountsController.show')
	Route.patch('/accounts/:id', 'AccountsController.edit')
	Route.get('/me', 'AuthController.GetUserInfo')


	Route.post('/subscribe', 'SubscriptionsController.subscribeToPlan')
	Route.get('/cards', 'SubscriptionsController.GetCard')
	Route.post('/add-card', 'SubscriptionsController.addCard')
	Route.post('/remove-card', 'SubscriptionsController.removeCard')
	Route.post('/topup-wallet', 'SubscriptionsController.topUPWallet')
	Route.get('/wallet', 'SubscriptionsController.GetWallet')
	Route.get('/transactions', 'SubscriptionsController.GetTransactions')

}).prefix('users').middleware('auth')




//MOVIES
Route.group(() => {
	Route.get('/', 'MoviesController.index') //list all movies
	Route.get('/:id', 'MoviesController.show').where('id', /^[0-9]+$/) //get single movie
}).prefix('movies')

// CASTS
Route.group(() => {
	Route.get('/', 'CastsController.index') //list all casts
}).prefix('casts')

// CLIPS
Route.group(() => {
	Route.get('/', 'ClipsController.index') //list all clips
}).prefix('clips')




// ADMIN
Route.group(() => {
	Route.group(() => {

	})
}).prefix('admin')

