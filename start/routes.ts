import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
	return view.render('welcome')
})



// AUTHENTICATION
Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.post('/verify-email', 'AuthController.verifyEmail')
Route.post('/resend-verification-email', 'AuthController.resendVerificationEmail')
Route.post('/forgot-password', 'AuthController.forgotPassword')
Route.post('/check-reset-password-otp', 'AuthController.checkResetPasswordOTP')
Route.post('/reset-password', 'AuthController.resetPassword')


//plans
Route.get('/plans', 'PlansController.index')
Route.get('/plans/:id', 'PlansController.show').where('id', /^[0-9]+$/)

//subscriptions webhooks
Route.get('/subscriptions/webhook-paystack', 'SubscriptionsController.webhookPaystack')



// AUTHENTICATED
Route.group(() => {

	//auth
	Route.post('/change-password', 'AuthController.changePassword')
	Route.post('/logout', 'AuthController.logout')

	// profile
	Route.get('/profile', 'AuthController.profile')
	Route.post('/profile', 'AuthController.updateProfile')


	//accounts
	Route.get('/accounts', 'AccountsController.index')
	Route.get('/accounts/:id', 'AccountsController.show')
	Route.post('/accounts', 'AccountsController.add')
	Route.post('/accounts/:id', 'AccountsController.update')
	Route.post('/accounts/delete/:id', 'AccountsController.delete')

	//wallet
	Route.get('/wallet', 'WalletController.index')

	//cards
	Route.get('/cards', 'CardsController.index')
	Route.get('/cards/:id', 'CardsController.show').where('id', /^[0-9]+$/)
	Route.post('/cards', 'CardsController.add')
	Route.post('/cards/:id', 'CardsController.update')
	Route.post('/cards/delete/:id', 'CardsController.delete')
	Route.get('/cards/default/', 'CardsController.getDefault')
	Route.post('/cards/default/:id', 'CardsController.setDefault')

	//subscriptions
	Route.get('/subscriptions', 'SubscriptionsController.index')
	Route.get('/subscriptions/:id', 'SubscriptionsController.show').where('id', /^[0-9]+$/)
	Route.get('/subscriptions/active', 'SubscriptionsController.getActiveSubscription')
	Route.post('/subscriptions/initialize', 'SubscriptionsController.initialize_subscription')
	Route.post('/subscriptions/verify/:id', 'SubscriptionsController.verify_subscription')
	Route.post('/subscriptions/cancel/:id', 'SubscriptionsController.cancel').where('id', /^[0-9]+$/)

	//payments
	Route.get('/payments', 'PaymentsController.index')
	Route.get('/payments/:id', 'PaymentsController.show').where('id', /^[0-9]+$/)



}).middleware('auth')














// ADMIN
Route.group(() => {

	//ALL ADMINS ACCESS



	// SUPER ADMIN ACCESS ONLY
	Route.group(() => {

		//plans
		Route.post('/plans', 'PlansController.add')
		Route.post('/plans/:id', 'PlansController.update')
		Route.post('/plans/delete/:id', 'PlansController.delete')

		//subscriptions
		Route.get('/subscriptions', 'AdminController.subscriptions')
		Route.get('/subscriptions/:id', 'AdminController.subscription').where('id', /^[0-9]+$/)

		//payments
		Route.get('/payments', 'AdminController.payments')
		Route.get('/payments/:id', 'AdminController.payment').where('id', /^[0-9]+$/)

	}).middleware('role:super-admin')


}).prefix('admin').middleware(['auth', 'role:admin,super-admin'])

