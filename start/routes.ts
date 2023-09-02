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

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.post('/verify-payment', 'SubscriptionsController.verifyPayments')
Route.get('/plans', 'SubscriptionsController.GetPlans')


Route.group(()=>{
  Route.post('/accounts', 'AccountsController.add')
  Route.get('accounts', 'AccountsController.index')
  Route.get('/accounts/:id', 'AccountsController.show')
  Route.patch('/accounts/:id', 'AccountsController.edit')
  
  
  Route.post('/subscribe', 'SubscriptionsController.subcribeTOPlan')
  Route.get('/cards', 'SubscriptionsController.GetCard')
  Route.post('add-card', 'SubscriptionsController.addCard')
  Route.post('/topup-wallet', 'SubscriptionsController.topUPWallet')
  Route.get('/wallet', 'SubscriptionsController.GetWallet')


 

 



}).prefix('users').middleware('auth')

Route.group(()=>{
  Route.get('/', 'MoviesController.GetAllMovies')
  Route.get('/series', 'MoviesController.GetAllShow')
  Route.get('/clips', 'MoviesController.GetClips')
  Route.get('/:id', 'MoviesController.GetMovie')
}).prefix('movies')
