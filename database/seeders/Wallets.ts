// code to seed the database with a user with all the expected fields

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Wallet from 'App/Models/Wallet'

export default class extends BaseSeeder {
	public async run() {
		await Wallet.createMany([
			{
				userId: 1,
				balance: 50000
			},
			{
				userId: 2,
				balance: 50000
			},
			{
				userId: 3,
				balance: 50000
			}
		])
	}
}

