const { client } = require('./')

const { createProduct, getAllProducts, getProductById, destroyProduct } = require('./products')
const { createUser, getUserById } = require('./users')
const { createReview, getReviewById, getAllReviews, destroyReview } = require('./reviews')
const { createCart, addToCart, getCartById, removeFromCart, getAllCarts, destroyCart } = require('./cart')

async function dropTables() {
  console.log("Dropping All Tables...")

  await client.query(`
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS carts;
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
        birthday DATE NOT NULL,
        cart integer ARRAY,
        active boolean DEFAULT TRUE,
        admin boolean DEFAULT FALSE
      );
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title varchar(255) NOT NULL,
        description TEXT NOT NULL, 
        type varchar(255) NOT NULL,
        price DECIMAL(19,3) NOT NULL
      );
      CREATE TABLE carts (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "productIds" INTEGER ARRAY
      );
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        name varchar(255) NOT NULL,
        description TEXT NOT NULL, 
        rating INTEGER NOT NULL,
        CHECK (rating BETWEEN 1 and 5),
        "productId" INTEGER REFERENCES products(id),
        "userId" INTEGER REFERENCES users(id)
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

async function testDeleteProduct() {
  try{
    console.log('Creating Test Products for deletion:')
    const testProduct1 = await createProduct({
      title:
        "The first most amazing test product",
      description:
        "Description for the first most amazing product ever....",
      type:
        "Product Type 1",
      price:
        100

    });

    const testProduct2 = await createProduct({
      title:
        "The second most amazing test product",
      description:
        "Description for the second most amazing product ever....",
      type:
        "Product Type 2",
      price:
        200
    });
    console.log("Grabbing products before deletion:", await getAllProducts())
    await destroyProduct(5)
    console.log("Grabbing products after deletion:", await getAllProducts())
  } catch(error){
    throw error
  }
}

async function createInitialUsers() {
  console.log("Creating initial users...")
  try {
    const usersToCreate = [
      { username: "sean", password: "seanpassword", birthday: "09-21-1993", admin: "true" },
      { username: "gary", password: "garypassword", birthday: "06-11-2022", admin: "true" },
      { username: "grant", password: "grantpassword", birthday: "07-11-2022", admin: "true" },
      { username: "wes", password: "wespassword", birthday: "07-11-2022", admin: "true" },
      { username: "brayden", password: "braydenpassword", birthday: "07-11-2022", admin: "true" }
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
      productId: productTest1.id,
      userId: 1
    })
    const review2 = await createReview({
      name: "Review 2",
      description: "Review Description 2",
      rating: 2,
      productId: productTest2.id,
      userId: 2
    })
    const review3 = await createReview({
      name: "Review 3",
      description: "Review Description 3",
      rating: 5,
      productId: productTest3.id,
      userId: 3
    });
    console.log("Finished creating reviews")
    console.log("Reviews created:")
    console.log(review1, review2, review3)
  } catch (error) {
    console.error("Error creating initial reviews")
    throw error
  }
}

async function testDeleteReview() {
  try{

    console.log("Grabbing reviews before deletion:", await getAllReviews())
    await destroyReview(3)
    console.log("Grabbing reviews after deletion:", await getAllReviews())
  } catch(error){
    throw error
  }
}

// async function createInitialCarts() {
//   console.log("Creating initial carts...")
//   try {
//     const cartOne = await createCart(2, [1])
//     const cartTwo = await createCart(1, [2])
//     const cartThree = await createCart(3, [3])
//     const cartFour = await createCart(null, [1])
//     console.log(cartOne, cartTwo, cartThree, cartFour)
//   } catch (error) {
//     throw error
//   }
// }


// async function testAddToCart () {
//   console.log("Testing add to cart function...")
//   try {
//   //  const test1 =  await getCartById(2)
//   //  console.log("First test:", test1)
//     const newTestCart = await addToCart(2, 3)
//     const anotherNewTestCart = await addToCart(2, 4)
//     // const test2 =  await getCartById(2)
//     // console.log("Second test:", test2)
//     // console.log(newTestCart)
//     console.log(newTestCart)
//     console.log(anotherNewTestCart)
//   }catch (error) {
//     throw error
//   }
// }

// async function testRemoveFromCart () {
//   console.log("Testing remove from cart function...")
//   try {
//   //  const test1 =  await getCartById(2)
//   //  console.log("First test:", test1)
//     const newTestCart = await addToCart(2, 3)
//     console.log("Test products added:", newTestCart)
//     const newTestCartRemove = await removeFromCart(2, 3)
//     console.log("Test products removed:", newTestCartRemove)
//     // const anotherNewTestCart = await addToCart(2, 4)
//     // const test2 =  await getCartById(2)
//     // console.log("Second test:", test2)
//     // console.log(newTestCart)
//     // console.log(newTestCart)
//     // console.log(anotherNewTestCart)
//   }catch (error) {
//     throw error
//   }
// }

// async function deleteCart(){
//   try{
//     console.log("Grabbing carts before deletion:", await getAllCarts())
//     await destroyCart(1)
//     console.log("Grabbing carts after deletion:", await getAllCarts())
//   }catch(error){
//     throw error
//   }
// }

async function buildDB() {
  try {
    // need to add something here
    client.connect();
    await dropTables();
    await createTables();
    await createInitialProducts();
    await testDeleteProduct();
    await createInitialUsers();
    await createInitialReviews();
    // await createInitialCarts();
    // await testAddToCart();
    // await testRemoveFromCart();
    // await testDeleteReview();
    // await deleteCart();
  }
  catch (ex) {
    console.log('Error building the DB')
    throw ex;
  }
}


buildDB()
  .catch(console.error)
  .finally(() => client.end())