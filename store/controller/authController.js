const User = require('../model/user');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle : 'Login Page',
        isLoggedIn : false,
        errors : null,
        oldInput : null,
    })
}

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(422).render('/login', {
            pageTitle: 'Login Page',
            isLoggedIn: false,
            errors: ['User does not exist'],
            oldInput: { email },
            user: {},
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword) { 
        return res.status(422).render('/login', {
            pageTitle : 'LoginPage',
            isLoggedIn : false,
            errors : ['password is incorrect'],
            oldInput : { email },
            user : {},
        });
    }

    req.session.isLoggedIn = true;
    // Convert Mongoose document to plain object to avoid serialization issues
    req.session.user = user.toObject();
    
    return req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).render('auth/login', {
                pageTitle: 'Login Page',
                isLoggedIn: false,
                errors: ['Error saving session. Please try again.'],
                oldInput: { email },
                user: {},
            });
        }
        console.log('Session data:', req.session);
        res.redirect('/');
    });
}

exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        pageTitle : 'Register User',
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

exports.getEditProfile = async (req, res, next) => {
    if(!req.user) {
        console.log('please Login First');
        return res.redirect('/login');
    }
    const userId = req.user._id;
    User.findById(userId).then( user => {
        if(!user) {
            console.log('user not found');
            return res.redirect('/login');
        } else {
            res.render('auth/editProfile', {
                pageTitle : 'Furni.',
                user,
                isLoggedIn : req.isLoggedIn,
                errors : null,
                oldInput : {
                    fullName : user.fullName,
                    email : user.email,
                    mobile : user.mobile,
                    gender : user.gender,
                },
            });
        }
    })
}

exports.postEditProfile = [

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
    const userId = req.user._id;
    const { fullName, email, mobile, gender, password } = req.body;
    console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/register', {
            pageTitle: 'Register User',
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

        const updatedData = {
            fullName, email, mobile, gender, password,
        }

        User.findByIdAndUpdate(userId, updatedData, {new : true}).then( () => { 
            console.log('User Edited');
            res.redirect('/user');
        }).catch(err => {
            console.log('error while registering user', err);
            res.render('auth/register', {
                pageTitle : 'Register User',
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