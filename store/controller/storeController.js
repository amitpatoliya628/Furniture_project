exports.getindex = (req, res, next) => {
    res.render('store/index',{
        pageTitle : 'Home Page',
    });
}

exports.getShop = (req, res, next) => {
    res.render('store/shop', {
        pageTitle : 'Shop Page',
    });
}

exports.getAbout =(req, res, next) => {
    res.render('store/about', {
        pageTitle : 'About Page',
    })
}

exports.getBlog = (req, res, next) => {
    res.render('store/blog', {
        pageTitle : 'Blog Page',
    })
}

exports.getContact = (req, res, next) => {
    res.render('store/contact', {
        pageTitle : 'Contact Page',
    })
}

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle : 'Login Page',
    })
}