const { client } = require('./')

const { createProduct } = require('./products')
const { createUser } = require('./users')

async function dropTables() {
  try {
    console.log('Dropping Tables')
    // add code here
    await client.query(`
      DROP TABLE IF EXISTS products;
    `)
    
    console.log('Finished Dropping Tables')
  } 
  catch(ex) {
    console.log('error dropping tables')
  }
}

async function createTables() {
  try {
    console.log('Creating Tables')
    // add code here
    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description VARCHAR(255),
        type VARCHAR(255), 
        price MONEY NOT NULL,
      );
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          birthday DATE NOT NULL, 
          address VARCHAR(255) NOT NULL, 
          active boolean DEFAULT true
      );
      CREATE TABLE orders (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          address VARCHAR(255) NOT NULL, 
          price MONEY NOT NULL,
      );
      CREATE TABLE reviews (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          description TEXT,
          rating INTEGER(5),
          "productId" INTEGER REFERENCES products(id),
      );
    `)
    
    console.log('Finished Creating Tables')
  } 
  catch(ex) {
    console.log('error creating tables')
  }
}

async function createInitialProducts() {
  try {
    console.log('Creating Products')
    await createProduct({
      title:
        "The first most amazing product",
      description:
        "Description for the first most amazing product ever...."
    });
    
    await createProduct({
      title:
        "The second most amazing product",
      description:
        "Description for the second most amazing product ever...."
    });
    
    await createProduct({
      title:
        "The third most amazing product",
      description:
        "Description for the third most amazing product ever...."
    });
    
    console.log('Finished creating Products')
  } 
  catch(ex) {
    console.log('error creating Products')
  }
}

async function createInitialUsers() {
  console.log("Creating initial users...")
  try {
    const usersToCreate = [
      { username: "albert", password: "bertie99", name: "Albert",  birthday: 11052022, address: "testLocation1"},
      { username: "sandra", password: "sandra123", name:"Sandra", birthday: 11062022, address: "testLocation2"},
      { username: "glamgal", password: "glamgal123", name:"Glamgal", birthday: 11072022, address:"testLocation3" },
    ]
    const users = await Promise.all(usersToCreate.map(createUser))
    console.log("Users created:")
    console.log(users)
    console.log("Finished creating intial users")
  } catch(error) {
    console.error("Error creating initial users")
    throw error
  }
}
async function buildDB() {
  try {
    // need to add something here
    client.connect();
    await dropTables();
    await createTables();
    await createInitialProducts();
    await createInitialUsers();
  }
  catch(ex) {
    console.log('Error building the DB')
    throw ex;
  }
}


buildDB()
  .catch(console.error)
  .finally(() => client.end())