const { client } = require('./');

async function createReview({name, description, rating,  productId}) {
    try {
      const { rows: [review]} = await client.query(`
        INSERT INTO reviews (name, description, rating, "productId")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [name, description, rating, productId])
      
      return review;
    }
    catch(error) {
      throw error
    }
  }
  
  
  module.exports = {
    createReview
  }