const express = require('express');
const hostRouter = express.Router();

const hostController = require('../controller/hostController');

hostRouter.get('/hostLogin', hostController.getHostLogin);
hostRouter.post('/hostLogin', hostController.postHostLogin);
hostRouter.get('/addProduct', hostController.getAddProduct);
hostRouter.post('/addProduct', hostController.postAddProduct);
hostRouter.get('/productList', hostController.getProductList);

hostRouter.get('/product/:productId',hostController.getProductDetails);
hostRouter.get('/editProduct/:productId', hostController.getEditProduct);
hostRouter.post('/editProduct', hostController.postEditProduct);
hostRouter.post('/productDelete', hostController.postDeleteProduct);

hostRouter.get('/coupons', hostController.getCoupons);
hostRouter.post('/addCoupon', hostController.postAddCoupon);
hostRouter.post('/deleteCoupon', hostController.postDeleteCoupon);

module.exports = hostRouter;