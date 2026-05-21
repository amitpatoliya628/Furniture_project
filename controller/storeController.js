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

exports.getServices = (req, res, next) => {
    res.render('store/services', {
        pageTitle : 'Service Page',
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