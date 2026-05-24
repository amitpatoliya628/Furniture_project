const express = require('express');
const hostRouter = express.Router();

const hostController = require('../controller/hostController');

hostRouter.get('/addProduct', hostController.getAddProduct);
hostRouter.post('/addProduct', hostController.postAddProduct);
hostRouter.get('/productList', hostController.getProductList);

module.exports = hostRouter;