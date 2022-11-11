const { client } = require('./');

async function createUser ({username, password, name,  birthday, address}) {
    try {
        const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password, name, birthday, address)
        VALUES($1, $2, $3, $4, $5)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, password, name, birthday, address])
        return user;
    }
    catch (error) {
        throw error
    }
}

async function addToCart (productId) {
    try{
        await client.query(`
        INSERT INTO users(cart)
        VALUES ($1)
        ON CONFLICT (cart) DO NOTHING
        `, [productId])

    }catch(error){
        throw error;
    }
}

// async function addtoUserCart(users) {
//     try{
//         const 
//     } catch(error) {
//         throw error
//     }
// }

module.exports = {createUser, addToCart}