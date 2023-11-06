// code to seed the database with a user with all the expected fields

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
	public async run() {
		await User.createMany([
			{
				name: "Cinemo",
				email: "mail.cinemo@gmail.com",
				password: "password",
				isSubscribed: true,
				planId: 2,
				roleId: 1, //super admin
			},
			{
				name: "William",
				email: "jesulonimii.will@gmail.com",
				password: "password",
				isSubscribed: true,
				planId: 2,
				roleId: 4, //user
			},
			{
				name: "Seun",
				email: "iamseunoyeniyi@gmail.com",
				password: "password",
				isSubscribed: true,
				planId: 2,
				roleId: 4, //user
			},
		])
	}
}

