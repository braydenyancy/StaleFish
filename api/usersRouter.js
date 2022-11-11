const express = require('express');

const usersRouter = express.Router();

usersRouter.get('/', (req, res, next) => {
  res.send('LIST OF USERS')
})

module.exports = usersRouter;