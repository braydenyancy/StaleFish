const { client } = require('./');

async function createReview({name, description, rating,  productId}) {
    try {
      const { rows: [review]} = await client.query(`
        INSERT INTO products (name, description, rating, "productId")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [name, description, rating, productId])
      
      return product;
    }
    catch(ex) {
      console.log('error in createProduct adapter function')
    }
  }
  
  
  module.exports = {
    createReview
  }