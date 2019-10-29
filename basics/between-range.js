const argv = require('yargs')
  .demand('credentials')
  .demand('start')
  .demand('end')
  .argv
const _ = require('lodash')
const redis = require('redis')
const rk = require('rk')
const Table = require('cli-table')

const credentails = require(argv.credentials)
const client = redis.createClient(credentails)
const keyRoot = 'mygarage'
const items = rk(keyRoot, 'cars', '*')


function betweenRange() {
  
  client
    .multi()
    .zunionstore('temp', '1', rk(keyRoot, 'priceIndex'))
    .zremrangebyscore('temp', '-inf', argv.start)
    .zremrangebyscore('temp', argv.end, '+inf')
    .sort(
      'temp',
      'BY', items+'->price',
      'GET', '#',
      'GET', items+'->name',
      'GET', items+'->type',
      'GET', items+'->price'
    )
    .del('temp')
    .exec(function(err,allResponses) {

      if (err) { throw err }

      const itemData = allResponses[3]

      const itemsTable = new Table({
        head: ['ID', 'Name', 'Type', 'Price']
      })

      _(itemData)
        .chunk(4)
        .forEach(function(anItem) {
          itemsTable.push(anItem)
        })

      console.log(itemsTable.toString())
      console.log(itemsTable.length)

      client.quit()
    })
}

betweenRange()

