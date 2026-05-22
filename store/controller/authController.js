exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle : 'Login Page',
    })
}

exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        pageTitle : 'Register User',
    })
}