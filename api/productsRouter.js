const express = require('express');
const productsRouter = express.Router();
const { getAllProducts, createProduct, getProductById, destroyProduct  } = require('../db/products');
const { requireAdmin, requireUser } = require("./utils");

productsRouter.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products)
  } catch (error) {
    throw error;
  }
  // res.send('List of Products')
});

productsRouter.post('/', [requireUser, requireAdmin], async (req, res, next) => {
  const { title, description, type, price } = req.body
  const product = {}
  try {
      product.title = title
      product.description = description
      product.type = type
      product.price = price

      const createdProduct = await createProduct(product)

      if (createdProduct){
      res.send(createdProduct);
      }
  } catch (error) {
      res.send({
          name: "CreateProduct",
          message: "Failure to create product",
          error
      })
  } 
})

productsRouter.delete("/", [requireUser, requireAdmin], async (req, res, next) => {
  const { id } = req.params;

  try {
      console.log("Deleting Product...")
      const deletedProduct = await destroyProduct(id);
      res.send(deletedProduct[0])  
      console.log("Product Deleted:", deletedProduct)           
  }catch(error){
    res.send({
      name: "Delete Product",
      message: "Failure to delete product",
      error
  })    
  }
})

module.exports = productsRouter;