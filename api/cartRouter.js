const express = require('express');
const cartRouter = express.Router();
const { createCart, getCartByUserId, getCartById } = require('../db/cart');
const { requireAdmin, requireUser } = require("./utils");

cartRouter.get("/:userId", requireUser, async (req, res, next) => {
    
  const { userId } = req.params

  try {
  
      const cart = await getCartByUserId(userId)
  

  
          res.send(cart)

  } catch (error) {
      res.send({
          message: "Requested cart was not found",
          name: "CartNotFoundError",
          error
      })
  }
})

cartRouter.post('/', async (req, res, next) => {
  const { productIds } = req.body;
  const cart = {};

  try {
    cart.productIds = productIds;
    if (!req.user) {
      cart.userId = null
    }
    else {
      cart.userId = req.user.id;
    }
    const newCart = await createCart(cart.userId, cart.productIds);

    res.send(newCart);

  } catch (error) {
    throw (error)
  }
})

module.exports = cartRouter;