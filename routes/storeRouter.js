const express = require('express');
const storeRouter = express.Router();

//local module
const storeController = require('../controller/storeController');

storeRouter.get('/', storeController.getindex);
storeRouter.get('/shop', storeController.getShop);

module.exports = storeRouter;