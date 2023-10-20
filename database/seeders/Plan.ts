import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Plan from 'App/Models/Plan'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Plan.createMany([
      {
        name: 'Basic',
        price: 897.00
      
      },
      {
        name: 'Premium',
        price: 1532.00
        
      }
    ])
  }
}
