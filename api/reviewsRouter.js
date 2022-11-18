const express = require('express');

const reviewsRouter = express.Router();

reviewsRouter.get('/', (req, res, next) => {
  res.send('LIST OF REVIEWS')
})

module.exports = reviewsRouter;