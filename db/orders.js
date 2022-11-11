const { client } = require('./');
const { createProduct, getProductById } = require('./products')

async function createOrder({name, address, price, products = []}) {
    try {
      const { rows: [ order ]} = await client.query(`
        INSERT INTO orders (name, address, price )
        VALUES ($1, $2, $3)
        RETURNING *;
      `, [name, address, price])

      
      
      // const productList = await Promise.all (products.map(product => getProductById(product.id) 
      // ));
      // const total = product.price
      // const productList = await createProduct(products)

      return order;
    }
    catch(ex) {
      console.log('error in createOrder adapter function')
    }
  }

  module.exports = { createOrder }