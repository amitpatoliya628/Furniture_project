const express = require('express');
const authRouter = express.Router();

//local module
const authController = require('../controller/authController');

authRouter.get('/login', authController.getLogin);
authRouter.post('/login', authController.postLogin);
authRouter.get('/register', authController.getRegister);
authRouter.post('/register', authController.postRegister);
authRouter.get('/edit-profile', authController.getEditProfile);
authRouter.post('/editProfile', authController.postEditProfile);
authRouter.get('/logout', authController.getLogout);

module.exports = authRouter;