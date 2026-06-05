const Products = require('../model/product');
const User = require('../model/user');
const Order = require('../model/orders');

const newsLatter = require('../model/newsLatter');
const contactMessage = require('../model/contactMessage');

exports.getindex = async (req, res, next) => {
    try {

        const randomProducts = await Products.aggregate([
            { $sample : {size : 6} },
        ])

        res.render('store/index',{
            pageTitle : 'Home Page',
            randomProducts : randomProducts,
            isLoggedIn : req.isLoggedIn,
        });

    } catch (error) {
        console.log(error);
    }
    
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

exports.getUser = async (req, res, next) => {
    if(!req.user) {
        console.log('please Login First');
        return res.redirect('/login');
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    const orders = await Order.find({ userId : userId });
    console.log(orders);

    res.render('store/user', {
        pageTitle : 'User Page',
        user,
        orders,
        isLoggedIn : req.isLoggedIn,
    })
}

exports.getCheckout = async (req, res, next) => {
    if(!req.user){
        console.log('please Login First');
        return res.redirect('/login');
    }

    const subTotal = req.body.subTotalAmount;
    const discount = req.body.discount;
    const total = req.body.totalAmount;
    const quantities = req.body.quantities ? JSON.parse(req.body.quantities) : {};
    const userId = req.user._id;
    const user = await User.findById(userId);

    const cartProducts = user.cart.map( productId => {
        return Products.findById(productId);
    });

    const resolvedCartProducts = await Promise.all(cartProducts);

    res.render('store/checkout', {
        pageTitle : 'Checkout Page',
        user,
        cartProducts: resolvedCartProducts,
        quantities: quantities,
        subTotal,
        discount,
        total,
        isLoggedIn : req.isLoggedIn,
    })
}

exports.postPlaceOrder = [

    async (req, res, next) => {
    if(!req.user){
        console.log('are you trying to redirect without login');
        return res.redirect('/login');
    }

    const { c_fname, c_email_address, c_phone, c_address, c_address2, c_city, c_state_country, c_postal_zip } = req.body;
    const c_full_address = c_address + c_address2;
    const { orderTotal, paymentMethod, paymentOption } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Parse quantities from request body
    const quantities = req.body.quantities ? JSON.parse(req.body.quantities) : {};

    // Build orderItems array with quantities
    const orderItems = [];
    for (const productId of user.cart) {
        const product = await Products.findById(productId);
        if (product) {
            const quantity = quantities[productId] ? parseInt(quantities[productId]) : 1;
            orderItems.push({
                productId: productId,
                price: product.price,
                quantity: quantity,
                totalPrice: product.price * quantity
            });
        }
    }

    const order = new Order({
        userId,
        name : user.fullName,
        email : user.email,
        phone : user.mobile,
        orderItems: orderItems,
        shippingAddress: {
            fullName: c_fname,
            phone: c_phone,
            address: c_full_address,
            city : c_city,
            state : c_state_country,
            pinCode : c_postal_zip,
        },
        total : orderTotal,
        paymentMethod : paymentMethod,

    });

    await order.save().then( async () => {
        console.log('order placed successfully');
        // Use findByIdAndUpdate to avoid version conflicts
        await User.findByIdAndUpdate(userId, { cart: [] }, { new: true });
        return res.redirect('/thankyou');
    }).catch( err => {
        console.log('error while placing order', err);
    });
}
]

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