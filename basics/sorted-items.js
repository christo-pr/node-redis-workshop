const argv = require('yargs').demand('credentials').argv
const _ = require('lodash')
const redis = require('redis')
const rk = require('rk')
const Table = require('cli-table')

const credentails = require(argv.credentials)
const client = redis.createClient(credentails)
const keyRoot = 'mygarage'
const items = rk(keyRoot, 'cars', '*')


function sortedValues() {
    
  client.sort(
    rk(keyRoot,'all-cars'),
    'BY', items+'->price',
    'GET', '#',
    'GET', items+'->name',
    'GET', items+'->type',
    'GET', items+'->price',

    function(err,itemData) {

      if (err) { throw err }

      let itemsTable = new Table({
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
    }
  )
}


sortedValues()
  
