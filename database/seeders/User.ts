// code to seed the database with a user with all the expected fields

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
	public async run() {
		await User.createMany([
			{
				name: "William",
				email: "jesulonimii.will@gmail.com",
				password: "$scrypt$n=16384,r=8,p=1$Y81kxZnOHdAxHfgmPct9hQ$BOebbxpagEcqrV/VE7ZAGVipMDzpCXeQGNXxlBs0EZMlNhubN1JyyViPbCWy2Gxm/TkZ6NTHq6tbw0s7rcCYmg",
				is_subscribed: true,
				plan_id: 2,
			}
		])
	}
}

