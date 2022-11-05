const { client } = require('./');

async function createUser ({username, password, name, location, birthday, address}) {
    try {
        const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password, name, location, birthday, address)
        VALUES($1, $2, $3, $4, $5, $6)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, password, name, location, birthday, address])
    }
    catch (ex) {
        console.log("Error with createUser function")
    }
}

module.exports = {createUser}