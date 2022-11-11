const { client } = require('./')

const { createProduct, getAllProducts, getProductById } = require('./products')
const { createUser } = require('./users')
const { createReview } = require('./reviews')

async function dropTables() {
  console.log("Dropping All Tables...")

  await client.query(`
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart;
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
        cart integer ARRAY,
        address varchar(255) NOT NULL,
        active boolean DEFAULT true
      );
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title varchar(255) NOT NULL,
        description TEXT NOT NULL, 
        type varchar(255) NOT NULL,
        price DECIMAL(19,3) NOT NULL
      );
      CREATE TABLE cart (
        "userId" INTEGER REFERENCES users(id),
        "productIds" INTEGER ARRAY
      );
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        name varchar(255) NOT NULL,
        address varchar(255) NOT NULL, 
        price DECIMAL(19,3) NOT NULL
        );
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        name varchar(255) NOT NULL,
        description TEXT NOT NULL, 
        rating INTEGER NOT NULL,
        CHECK (rating BETWEEN 1 and 5),
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
        100

    });

    const product2 = await createProduct({
      title:
        "The second most amazing product",
      description:
        "Description for the second most amazing product ever....",
      type:
        "Product Type 2",
      price:
        200
    });

    const product3 = await createProduct({
      title:
        "The third most amazing product",
      description:
        "Description for the third most amazing product ever....",
      type:
        "Product Type 3",
      price:
        300
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

async function createInitialReviews() {
  console.log("Creating initial reviews...")
  const [productTest1, productTest2, productTest3] = await getAllProducts()
  try {
    const review1 = await createReview({
      name: "Review 1",
      description: "Review Description 1",
      rating: 1,
      productId: productTest1.id
    })
    const review2 = await createReview({
      name: "Review 2",
      description: "Review Description 2",
      rating: 2,
      productId: productTest2.id
    })
    const review3 = await createReview({
      name: "Review 3",
      description: "Review Description 3",
      rating: 5,
      productId: productTest3.id
    });
    console.log("Finished creating reviews")
    console.log("Reviews created:")
    console.log(review1, review2, review3)
  } catch (error) {
    console.error("Error creating initial reviews")
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
    await createInitialReviews();
  }
  catch (ex) {
    console.log('Error building the DB')
    throw ex;
  }
}


buildDB()
  .catch(console.error)
  .finally(() => client.end())