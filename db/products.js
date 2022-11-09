const { client } = require('./');

async function createProduct({title, description, type,  price}) {
  try {
    const { rows: [product]} = await client.query(`
      INSERT INTO products (title, description, type, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [title, description, type, price])
    
    return product;
  }
  catch(error) {
    throw error
  }
}


module.exports = {
  createProduct
}