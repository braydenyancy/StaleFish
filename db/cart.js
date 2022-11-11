const { client } = require('./');

// async function getCart(){
//     try {
//         const { rows: cartId } = client.query(`
//             SELECT id
//             FROM carts;
//         `);
//         const carts = await Promise.all(cartId.map(
//             cart => get
//         ))
//     }catch(error){
//         throw error
//     }
// }

async function createCart(userId, productIds ) {
    try {
      const { rows: [cart] } = await client.query(`
          INSERT INTO carts ("userId", "productIds") 
            VALUES($1, $2) 
            RETURNING *;
          `, [userId, productIds,]);
  
      return cart;
    } catch (error) {
      throw error
    }
  }

async function getCartById(userId) {
    try {
      const { rows: [cart] } = await client.query(`
        SELECT *
        FROM carts
        WHERE "userId"=$1;
      `, [userId]);
  
      if (!cart) {
        throw {
          error: "error",
          name: "CartNotFound",
          message: "Cart was not found"
        };
      }
  
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async function updateCart(userId) {
      try{
        
      } catch (error) {
          throw error;
      }
  }

module.exports = { createCart, getCartById }