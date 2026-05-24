const Products = require('../model/product');

exports.getindex = (req, res, next) => {
    res.render('store/index',{
        pageTitle : 'Home Page',
    });
}

exports.getShop = (req, res, next) => {
    Products.find().then( products => {
        res.render('store/shop', {
            products : products,
            pageTitle : 'Shop Page',
        });
    } )
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

exports.getCart = (req, res, next) => {
    res.render('store/cart', {
        pageTitle : 'Cart ',
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('store/checkout', {
        pageTitle : 'Checkout Page',
    })
}

exports.getThankyou = (req, res, next) => {
    res.render('store/thankyou', {
        pageTitle : 'Thankyou Page',
    })
}



exports.getCategoryProducts = (req,res, next) => {
    const category = req.params.category;
    console.log(category);
    
    Products.find({ category : category }).then( products => {
        res.render('store/category', {
            category,
            products,
            pageTitle : 'Category Page',
        });
    } )
}