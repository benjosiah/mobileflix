// code to seed the database with a user with all the expected fields

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
	public async run() {
		await User.createMany([
			{
				name: "William",
				email: "jesulonimii.will@gmail.com",
				password: "", //@jesulonimii, use your normal password here, It will now be automatically hashed (see User.ts)
				is_subscribed: true,
				plan_id: 2,
			},
			{
				name: "Seun",
				email: "iamseunoyeniyi@gmail.com",
				password: "helloworld",
				is_subscribed: true,
				plan_id: 2,
			},
		])
	}
}

