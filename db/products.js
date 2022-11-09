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
 
async function getAllProducts() {
  try {
    const { rows: productID } = await client.query(`
      SELECT id
      FROM products; 
    `);

    const products = await Promise.all(productID.map(
      product => getProductById(product.id)
    ));
    return products
  } catch (error) {
    throw error
  }
}

async function getProductById(id) {
  try {
    const { rows: [product] } = await client.query(`
      SELECT *
      FROM products
      WHERE id=$1;  
    `, [id]);

    if (!product) {
      throw {
        error: "error",
        name: "Product Not Found",
        message: "The requested product was not found"
      };
      // console.log("Error finding product")
    }

    return product
  } catch(error) {
    throw error;
  }
}

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
}