const express = require('express');
const storeRouter = express.Router();

//local module
const storeController = require('../controller/storeController');

storeRouter.get('/', storeController.getindex);
storeRouter.get('/shop', storeController.getShop);
storeRouter.get('/about', storeController.getAbout);
storeRouter.get('/blog', storeController.getBlog);
storeRouter.get('/contact', storeController.getContact);
storeRouter.get('/cart', storeController.getCart);
storeRouter.get('/checkout', storeController.getCheckout);
storeRouter.get('/thankyou', storeController.getThankyou);

storeRouter.get('/product/:productId', storeController.getProductDetails);
storeRouter.get('/addToCart/:productId', storeController.getAddToCart);
storeRouter.get('/category/:category', storeController.getCategoryProducts);

storeRouter.post('/subscribe', storeController.postSubscribe);
storeRouter.post('/contactMessage', storeController.postContactMessage);


module.exports = storeRouter;