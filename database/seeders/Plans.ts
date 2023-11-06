import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Plan from 'App/Models/Plan'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Plan.createMany([
      {
        name: 'Basic',
        description: 'Basic plan',
        price: 1000,
        validityDays: 30,
        maxDevices: 1
      },
      {
        name: 'Standard',
        description: 'Standard plan',
        price: 2000,
        validityDays: 30,
        maxDevices: 2
      },
      {
        name: 'Premium',
        description: 'Premium plan',
        price: 3000,
        validityDays: 30,
        maxDevices: 3
      }
    ])
  }
}
