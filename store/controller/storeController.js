const Products = require('../model/product');

const newsLatter = require('../model/newsLatter');
const contactMessage = require('../model/contactMessage');

exports.getindex = (req, res, next) => {
    res.render('store/index',{
        pageTitle : 'Home Page',
        pagelink : '/',
        isLoggedIn : req.isLoggedIn,
    });
}

exports.getShop = (req, res, next) => {
    Products.find().then( products => {
        res.render('store/shop', {
            products : products,
            pageTitle : 'Shop Page',
            pagelink : '/shop',
            isLoggedIn : req.isLoggedIn,
        });
    } )
}

exports.getAbout =(req, res, next) => {
    res.render('store/about', {
        pageTitle : 'About Page',
        pagelink : '/about',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getBlog = (req, res, next) => {
    res.render('store/blog', {
        pageTitle : 'Blog Page',
        pagelink : '/blog',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getContact = (req, res, next) => {
    res.render('store/contact', {
        pageTitle : 'Contact Page',
        pagelink : '/contact',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getCart = (req, res, next) => {
    res.render('store/cart', {
        pageTitle : 'Cart ',
        pagelink : '/cart',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('store/checkout', {
        pageTitle : 'Checkout Page',
        pagelink : '/checkout',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getThankyou = (req, res, next) => {
    res.render('store/thankyou', {
        pageTitle : 'Thankyou Page',
        pagelink : '/thankyou',
        isLoggedIn : req.isLoggedIn,
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
            pagelink : `/category/${category}`,
            isLoggedIn : req.isLoggedIn,
        });
    } )
}



exports.postSubscribe = (req, res, next) => {
    const { name, email } = req.body;

    const newslatter = new newsLatter({
        name,
        email,
    });
    newslatter.save().then( () => {
        console.log('save to newslatter');
        res.redirect(req.get('referer') + '?success=true');
    });
    
}


exports.postContactMessage = (req, res, next) => {
    const { fname, lname, email, message } = req.body;

    const contactmsg = new contactMessage({
        fname,
        lname,
        email,
        message,
    });
    contactmsg.save().then( () => {
        console.log('saved to contact message');
        res.redirect(req.get('referer') + '?contactSuccess=true');
    })
}