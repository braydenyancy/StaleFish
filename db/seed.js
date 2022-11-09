const { client } = require('./')

const { createProduct } = require('./products')
const { createUser } = require('./users')

async function dropTables() {
  console.log("Dropping All Tables...")

  await client.query(`
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    `);

  console.log("Finished dropping tables!");

  // drop all tables, in the correct order
}

async function createTables() {
  try {
    console.log("Starting to build tables...")
    // create all tables, in the correct order
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        birthday DATE NOT NULL,
        address varchar(255) NOT NULL,
        active boolean DEFAULT true
      );
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title varchar(255) NOT NULL,
        description TEXT NOT NULL, 
        type varchar(255) NOT NULL,
        price MONEY NOT NULL
      );
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        name varchar(255) NOT NULL,
        address varchar(255) NOT NULL, 
        price MONEY NOT NULL
        );
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        name varchar(255) NOT NULL,
        description TEXT NOT NULL, 
        "productId" INTEGER REFERENCES products(id)
      );  
  `);

    console.log("Finished building tables!")
  } catch (error) {
    console.error("Error building tables!")
  }
}

async function createInitialProducts() {
  try {
    console.log('Creating Products')
    const product1 = await createProduct({
      title:
        "The first most amazing product",
      description:
        "Description for the first most amazing product ever....",
      type:
        "Product Type 1",
      price:
        "$100"

    });

    const product2 = await createProduct({
      title:
        "The second most amazing product",
      description:
        "Description for the second most amazing product ever....",
      type:
        "Product Type 2",
      price:
        "$200"
    });

    const product3 = await createProduct({
      title:
        "The third most amazing product",
      description:
        "Description for the third most amazing product ever....",
      type:
        "Product Type 3",
      price:
        "$300"
    });

    console.log('Finished creating Products')
    console.log("Products created:")
    console.log(product1, product2, product3)
  }
  catch (error) {
    console.error('error creating Products')
  }
}

async function createInitialUsers() {
  console.log("Creating initial users...")
  try {
    const usersToCreate = [
      { username: "albert", password: "bertie99", name: "Albert", birthday: "05-11-2022", address: "testLocation1" },
      { username: "sandra", password: "sandra123", name: "Sandra", birthday: "06-11-2022", address: "testLocation2" },
      { username: "glamgal", password: "glamgal123", name: "Glamgal", birthday: "07-11-2022", address: "testLocation3" },
    ]
    const users = await Promise.all(usersToCreate.map(createUser))
    console.log("Users created:")
    console.log(users)
    console.log("Finished creating intial users")
  } catch (error) {
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
  catch (ex) {
    console.log('Error building the DB')
    throw ex;
  }
}


buildDB()
  .catch(console.error)
  .finally(() => client.end())