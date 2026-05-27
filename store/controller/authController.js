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
    })
}

