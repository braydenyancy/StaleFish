const express = require('express');
const apiRouter = express.Router();
const { JWT_SECRET } = process.env
const jwt = require('jsonwebtoken')
const { getUserById } = require('../db')

apiRouter.get('/health', (req, res, next) => {
    try {
        let response = {message: 'all is well'}
        res.send(response)
  
    } catch (error) {
        console.error
        throw error
    }
    next()
});

apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if(!auth) {
        next();
    } else if(auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)
    
        try {
            const {id} = jwt.verify(token, JWT_SECRET)
            if (id) {
                req.user = await getUserById(id);
                next();
            }
        } catch ({name, message}) {
            next({name, message})
        }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        })
    }
})

apiRouter.use((req, res, next) => {
    if (req.user){
        console.log('user is set:', req.user)
    }
    next()
})




const productsRouter = require('./productsRouter');
apiRouter.use('/products', productsRouter);


apiRouter.use((error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message,
        error: error.error
    })
})

apiRouter.use("/unknown", async(req ,res)=>{
    await res.status(404).send({
        message: 'Not a valid url'})
})

module.exports = apiRouter;