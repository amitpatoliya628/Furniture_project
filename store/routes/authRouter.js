const express = require('express');
const authRouter = express.Router();

//local module
const authController = require('../controller/authController');

authRouter.get('/login', authController.getLogin);
authRouter.get('/register', authController.getRegister);

module.exports = authRouter;