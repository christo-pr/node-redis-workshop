const faker = require('faker')
const fs = require('fs')

function generateData(amount) {

  const data = [] 

  for (let i=0; i < amount; i++){
    let info = {}

    info.id = i
    info.name = faker.vehicle.model()
    info.manufacturer = faker.vehicle.manufacturer()
    info.type = faker.vehicle.type()
    info.fuel = faker.vehicle.fuel()
    info.price = faker.finance.amount()
    info.img = faker.image.transport()

    data.push(info)

  }

  return data 
  
}

const carsJSON = generateData(50)

fs.writeFileSync('./utils/cars.json', JSON.stringify(carsJSON))

console.log('Garage created')

