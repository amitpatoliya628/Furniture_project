const express = require('express');
const hostRouter = express.Router();

const hostController = require('../controller/hostController');

hostRouter.get('/host/addProduct', hostController.getAddProduct);
hostRouter.post('/host/addProduct', hostController.postAddProduct);

module.exports = hostRouter;