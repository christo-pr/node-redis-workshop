const argv = require('yargs').demand('credentials').argv               
const async = require('async') 
const redis = require('redis')
const rk = require('rk')
const items = require('../utils/cars.json') 

const credentails = require(argv.credentials)
const client = redis.createClient(credentails)
const keyRoot = 'mygarage'

async.each(items, function(car,cb) {
  
  client
    .multi()
    .hmset(
      rk(keyRoot, 'cars', car.id),
       
      'name',
      car.name,
      
      'manufacturer',
      car.manufacturer,

      'type',
      car.type,

      'fuel',
      car.fuel,

      'price',
      car.price,

      'img',
      car.img

    )
    .sadd(
      rk(keyRoot,'all-cars'),
      car.id
    )
    .zadd(
      rk(keyRoot,'priceIndex'),
      car.price,
      car.id
    )
    .exec(function(err) {
      cb(err)
    })
}, function(err) {

  if (err) { throw err }

  console.log('Cars added.')

  client.quit()
})
