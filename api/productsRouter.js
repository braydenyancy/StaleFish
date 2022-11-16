const express = require('express');
const productsRouter = express.Router();
const { getAllProducts } = require('../db/products')

productsRouter.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products)
  } catch (error) {
    throw error;
  }
  // res.send('List of Products')
});

module.exports = productsRouter;