const Products = require('../model/product');
const User = require('../model/user');

const newsLatter = require('../model/newsLatter');
const contactMessage = require('../model/contactMessage');

exports.getindex = (req, res, next) => {
    res.render('store/index',{
        pageTitle : 'Home Page',
        isLoggedIn : req.isLoggedIn,
    });
}

exports.getShop = (req, res, next) => {
    Products.find().then( products => {
        res.render('store/shop', {
            products : products,
            pageTitle : 'Shop Page',
            isLoggedIn : req.isLoggedIn,
        });
    } )
}

exports.getAbout =(req, res, next) => {
    res.render('store/about', {
        pageTitle : 'About Page',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getBlog = (req, res, next) => {
    res.render('store/blog', {
        pageTitle : 'Blog Page',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getContact = (req, res, next) => {
    res.render('store/contact', {
        pageTitle : 'Contact Page',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getCart = (req, res, next) => {
    res.render('store/cart', {
        pageTitle : 'Cart ',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('store/checkout', {
        pageTitle : 'Checkout Page',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getThankyou = (req, res, next) => {
    res.render('store/thankyou', {
        pageTitle : 'Thankyou Page',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
        
    Products.findById(productId).then(product => {
        if(!product){
            console.log('Product not found');
            return res.redirect('/shop');
        }
        res.render('store/productDetails', {
            pageTitle : 'Product Details',
            product : product,
            isLoggedIn : req.isLoggedIn,
        })
    }).catch(err => {
        console.log('error while fetching product details', err);
        res.status(500).render('store/404', {
            pageTitle: 'Error',
            isLoggedIn : req.isLoggedIn,
        });
    })
}

exports.getAddToCart = async (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if(user.cart.includes(productId)) { 
        console.log('Already Added to Cart');
        return res.redirect('/cart');
    } else {
        user.cart.push(productId);
        await user.save();
    }

    console.log('user is login');
    res.redirect('/cart');

}

exports.getCategoryProducts = (req,res, next) => {
    const category = req.params.category;
    console.log(category);
    
    Products.find({ category : category }).then( products => {
        res.render('store/category', {
            category,
            products,
            pageTitle : 'Category Page',
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