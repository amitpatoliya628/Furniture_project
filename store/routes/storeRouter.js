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
storeRouter.get('/wishlist', storeController.getWishlist);
storeRouter.get('/user', storeController.getUser);
storeRouter.post('/checkout', storeController.getCheckout);
storeRouter.post('/placeOrder', storeController.postPlaceOrder);
storeRouter.get('/thankyou', storeController.getThankyou);

storeRouter.post('/productDetails', storeController.getProductDetails);
storeRouter.get('/product/:id', storeController.getProductById);
storeRouter.post('/addToCart', storeController.getAddToCart);
storeRouter.post('/removeFromCart', storeController.removeFromCart);
storeRouter.post('/addToWishlist', storeController.addToWishlist);
storeRouter.post('/removeFromWishlist', storeController.removeFromWishlist);
storeRouter.get('/category/:category', storeController.getCategoryProducts);
storeRouter.post('/apply-coupon', storeController.postApplyCoupon);
storeRouter.post('/remove-coupon', storeController.postRemoveCoupon);

storeRouter.post('/subscribe', storeController.postSubscribe);
storeRouter.post('/contactMessage', storeController.postContactMessage);
storeRouter.get('/order/:id', storeController.getOrderDetails);
storeRouter.post('/submitReview', storeController.postSubmitReview);


module.exports = storeRouter;