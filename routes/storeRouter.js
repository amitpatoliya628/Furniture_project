const express = require('express');
const storeRouter = express.Router();

//local module
const storeController = require('../controller/storeController');

storeRouter.get('/', storeController.getindex);
storeRouter.get('/shop', storeController.getShop);
storeRouter.get('/about', storeController.getAbout);
storeRouter.get('/services', storeController.getServices);
storeRouter.get('/blog', storeController.getBlog);
storeRouter.get('/contact', storeController.getContact);

module.exports = storeRouter;