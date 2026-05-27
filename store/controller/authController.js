const User = require('../model/user');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle : 'Login Page',
        pagelink : '/login',
        isLoggedIn : false,
    })
}

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    res.redirect('/');
}

exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        pageTitle : 'Register User',
        pagelink : '/register',
        isLoggedIn : false,
        errors : null,
        oldInput : null,
    })
}

exports.postRegister = [

check('fullName')
    .notEmpty()
    .withMessage('Full Name is required')
    .isLength({ min: 3 })
    .withMessage('Full Name should be at least 3 characters long')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Full Name should contain only alphabets and spaces'),

check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

check('mobile')
    .notEmpty()
    .withMessage('Mobile Number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Mobile Number should be a valid 10-digit number'),

check('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['male', 'female'])
    .withMessage('Gender should be either "male" or "female"'),

check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password should be at least 8 characters long')
    .trim(),

check('confirmPassword')
    .trim()
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),

(req, res, next) => {
    const { fullName, email, mobile, gender, password} = req.body;
    console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/register', {
            pageTitle: 'Register User',
            pagelink: '/register',
            isLoggedIn: false,
            errors: errors.array().map(err => err.msg),
            oldInput: {
                fullName,
                email,
                mobile,
                gender,
            }
        });
    }

    bcrypt.hash(password, 12).then( hashedPassword => {
        const user = new User({
            fullName,
            email,
            mobile,
            gender,
            password: hashedPassword,
        })

        user.save().then( () => { 
            console.log('User Registered');
            res.redirect('/login');
        }).catch(err => {
            console.log('error while registering user', err);
            res.render('auth/register', {
                pageTitle : 'Register User',
                pagelink : '/register',
                isLoggedIn : false,
                oldInput : {
                    fullName,
                    email,
                    mobile,
                    gender,
                }
            })
        });

    })

}
]



exports.getLogout = (req, res, next) => {
    req.session.destroy( () => {
        res.redirect('/');
    });
}