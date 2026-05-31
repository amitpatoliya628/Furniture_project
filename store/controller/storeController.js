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

exports.getCart = async (req, res, next) => {
    if(!req.user) {
        console.log('please Login first');
        return res.redirect('/login');
    }
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user) { 
        console.log('please Login first');
        return res.redirect('/login');
    }

    const cartProducts = user.cart.map( productId => {
        return Products.findById(productId);
    });

    const resolvedCartProducts = await Promise.all(cartProducts);

    res.render('store/cart', {
        pageTitle : 'Cart Page',
        isLoggedIn : req.isLoggedIn,
        cartProducts: resolvedCartProducts,
    });
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
    const productId = req.body.productId;
        
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
    const productId = req.body.productId;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if(user.cart.includes(productId)) { 
        console.log('Already Added to Cart');
        return res.redirect('/cart');
    } else {
        user.cart.push(productId);
        await user.save();
    }

    res.redirect('/cart');

}

exports.removeFromCart = async (req, res, next) => {
    console.log(req.body);
    const productId = req.body.productId;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if(!user.cart.includes(productId)) {
        console.log('product not found in cart');
        return res.redirect('/cart');
    } else {
        user.cart.pull(productId);
        await user.save();
        return res.redirect('/cart');
    }

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