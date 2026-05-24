const express = require('express');
const hostRouter = express.Router();

const hostController = require('../controller/hostController');

hostRouter.get('/addProduct', hostController.getAddProduct);
hostRouter.post('/addProduct', hostController.postAddProduct);

module.exports = hostRouter;