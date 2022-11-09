const { client } = require('./');

async function createOrder({name, address, price, products = []}) {
    try {
      const { rows: [ order ]} = await client.query(`
        INSERT INTO orders (name, address, price )
        VALUES ($1, $2, $3)
        RETURNING *;
      `, [name, address, price])
      
      return order;
    }
    catch(ex) {
      console.log('error in createOrder adapter function')
    }
  }

  module.exports = { createOrder }