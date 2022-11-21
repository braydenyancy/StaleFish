const { client } = require('./');

// function requireAdmin(req, res, next) {
//   if (!req.user.admin) {
//       res.status(401);
//       next({
//           error: "Not an admin",
//           name: "NotAdmin",
//           message: "You must be an admin to perform this action",
//       })
//   }
//   next()
// }

async function createProduct({title, description, type,  price}) {
  try {
    console.log("Before query:")
    const { rows: [product]} = await client.query(`
      INSERT INTO products (title, description, type, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [title, description, type, price])
    console.log(product)
    return product;
  }
  catch(error) {
    console.log(error)
    throw error
  }
}
 
async function getAllProducts() {
  try {
    const { rows: productID } = await client.query(`
      SELECT id
      FROM products; 
    `);
    // console.log(productID)
    const products = await Promise.all(productID.map(
      product => getProductById(product.id)
    ));
    return products;
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

async function updateProduct({id, ...fields}) {
  
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    if (setString.length > 0) {
      await client.query(`
        UPDATE products
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
    }

    return await getProductById(id);
  } catch (error) {
    throw error;
  }

}

async function destroyProduct(id) {
  try {

    const { rows } = await client.query(`
    DELETE from products
    WHERE id=$1
    RETURNING *;
  `, [id]);
    
    return rows;
  } catch (error) {
    throw error
  }
}

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  destroyProduct,
}