const argv = require('yargs').demand('credentials').argv               
const redis = require('redis')

const credentails = require(argv.credentials)
const client      = redis.createClient(credentails)

function flushDB() {
  client.flushdb( function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
    client.quit();
  });
}

flushDB()

