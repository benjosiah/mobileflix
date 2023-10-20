// code to seed the database with a user with all the expected fields

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Wallet from 'App/Models/Wallet'

export default class extends BaseSeeder {
	public async run() {
		await Wallet.createMany([
			{
				user_id: 1,
				balance: "50000"
			},
			{
				user_id: 2,
				balance: "50000"
			}
		])
	}
}

