const Products = require('../model/product');
const User = require('../model/user');
const Order = require('../model/orders');
const Review = require('../model/review');
const Coupon = require('../model/coupon');

const newsLatter = require('../model/newsLatter');
const contactMessage = require('../model/contactMessage');

async function getRecentReviews(limit = 10) {
    return Review.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'fullName gender')
        .populate('productId', 'name');
}

exports.getindex = async (req, res, next) => {
    try {

        const randomProducts = await Products.aggregate([
            { $sample : {size : 6} },
        ]);

        const categoryShowcase = await Products.aggregate([
            {
                $group: {
                    _id: "$category",
                    productId: { $first: "$_id" },
                    name: { $first: "$name" },
                    price: { $first: "$price" },
                    image: { $first: "$image" },
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    productId: 1,
                    name: 1,
                    price: 1,
                    image: 1
                }
            }
        ]);

        const reviews = await getRecentReviews();

        res.render('store/index',{
            pageTitle : 'Home Page',
            randomProducts : randomProducts,
            categoryShowcase : categoryShowcase,
            reviews : reviews,
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

exports.getAbout = async (req, res, next) => {
    try {
        const reviews = await getRecentReviews();
        res.render('store/about', {
            pageTitle : 'About Page',
            reviews : reviews,
            isLoggedIn : req.isLoggedIn,
        });
    } catch (error) {
        console.log(error);
    }
}

exports.getBlog = async (req, res, next) => {
    try {
        const reviews = await getRecentReviews();
        res.render('store/blog', {
            pageTitle : 'Blog Page',
            reviews : reviews,
            isLoggedIn : req.isLoggedIn,
        });
    } catch (error) {
        console.log(error);
    }
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

    // Fetch active coupons and applied coupon from session
    const availableCoupons = await Coupon.find({ isActive: true });
    const appliedCoupon = req.session.appliedCoupon || null;

    res.render('store/cart', {
        pageTitle : 'Cart Page',
        isLoggedIn : req.isLoggedIn,
        cartProducts: resolvedCartProducts,
        availableCoupons: availableCoupons,
        appliedCoupon: appliedCoupon
    });
}

exports.postApplyCoupon = async (req, res, next) => {
    try {
        const { couponCode, quantities } = req.body;
        if (!couponCode) {
            return res.json({ success: false, message: 'Please enter a coupon code' });
        }

        const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), isActive: true });
        if (!coupon) {
            return res.json({ success: false, message: 'Invalid or inactive coupon code' });
        }

        // Calculate subtotal from cart products
        if (!req.user) {
            return res.json({ success: false, message: 'Please log in to apply coupons' });
        }
        const user = await User.findById(req.user._id);
        
        let subtotal = 0;
        for (const productId of user.cart) {
            const product = await Products.findById(productId);
            if (product) {
                const qty = quantities && quantities[productId] ? parseInt(quantities[productId]) : 1;
                subtotal += product.price * qty;
            }
        }

        if (subtotal < coupon.minCartValue) {
            return res.json({ 
                success: false, 
                message: `Minimum purchase of ₹${coupon.minCartValue} required for this coupon.` 
            });
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = subtotal * (coupon.discountValue / 100);
        } else if (coupon.discountType === 'flat') {
            discount = Math.min(coupon.discountValue, subtotal);
        }

        // Save applied coupon details to session
        req.session.appliedCoupon = {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minCartValue: coupon.minCartValue
        };

        return res.json({
            success: true,
            couponCode: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minCartValue: coupon.minCartValue,
            discount: discount,
            total: subtotal - discount,
            message: `Coupon "${coupon.code}" applied successfully!`
        });
    } catch (err) {
        console.error("Error applying coupon:", err);
        return res.json({ success: false, message: 'An error occurred while applying the coupon.' });
    }
};

exports.postRemoveCoupon = async (req, res, next) => {
    req.session.appliedCoupon = null;
    return res.json({ success: true, message: 'Coupon removed successfully!' });
};

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
    const couponCode = req.body.couponCode || '';
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
        couponCode,
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
    const { orderTotal, discount, couponCode, paymentMethod, paymentOption } = req.body;
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
        discount : discount ? parseFloat(discount) : 0,
        couponCode : couponCode || null,
        paymentMethod : paymentMethod,

    });

    await order.save().then( async () => {
        console.log('order placed successfully');
        // Clear applied coupon from session
        req.session.appliedCoupon = null;
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

exports.getProductDetails = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        return renderProductDetails(req, res, productId);
    } catch (err) {
        console.log('error while fetching product details', err);
        res.status(500).render('store/404', {
            pageTitle: 'Error',
            isLoggedIn : req.isLoggedIn,
        });
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        return renderProductDetails(req, res, req.params.id);
    } catch (err) {
        console.log('error while fetching product details', err);
        res.status(500).render('store/404', {
            pageTitle: 'Error',
            isLoggedIn : req.isLoggedIn,
        });
    }
}

async function renderProductDetails(req, res, productId) {
    const product = await Products.findById(productId);

    if(!product){
        console.log('Product not found');
        return res.redirect('/shop');
    }

    let isInWishlist = false;
    if(req.user) {
        const user = await User.findById(req.user._id);
        isInWishlist = user.wishlist.some(id => id.toString() === productId.toString());
    }

    res.render('store/productDetails', {
        pageTitle : 'Product Details',
        product : product,
        isInWishlist : isInWishlist,
        isLoggedIn : req.isLoggedIn,
    });
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

exports.getWishlist = async (req, res, next) => {
    if(!req.user) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.user._id);
        const wishlistProducts = await Promise.all(
            user.wishlist.map(productId => Products.findById(productId))
        );
        const filteredProducts = wishlistProducts.filter(Boolean);

        res.render('store/wishlist', {
            pageTitle: 'Wishlist Page',
            isLoggedIn: req.isLoggedIn,
            wishlistProducts: filteredProducts,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

exports.addToWishlist = async (req, res, next) => {
    if(!req.user) {
        return res.redirect('/login');
    }

    try {
        const productId = req.body.productId;
        const user = await User.findById(req.user._id);
        const alreadyAdded = user.wishlist.some(id => id.toString() === productId.toString());

        if(!alreadyAdded) {
            user.wishlist.push(productId);
            await user.save();
        }

        const redirectTo = req.body.redirectTo || '/wishlist';
        return res.redirect(redirectTo);
    } catch (error) {
        console.log(error);
        return res.redirect('/shop');
    }
}

exports.removeFromWishlist = async (req, res, next) => {
    if(!req.user) {
        return res.redirect('/login');
    }

    try {
        const productId = req.body.productId;
        const user = await User.findById(req.user._id);
        const inWishlist = user.wishlist.some(id => id.toString() === productId.toString());

        if(inWishlist) {
            user.wishlist.pull(productId);
            await user.save();
        }

        const redirectTo = req.body.redirectTo || '/wishlist';
        return res.redirect(redirectTo);
    } catch (error) {
        console.log(error);
        return res.redirect('/wishlist');
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

exports.getOrderDetails = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('orderItems.productId');

        if (!order) {
            return res.render('store/404', {
                pageTitle: 'Order Not Found',
                isLoggedIn: req.isLoggedIn,
            });
        }

        // Check if the logged-in user owns this order
        if (req.user && req.user._id && req.user._id.toString() !== order.userId.toString()) {
            return res.render('store/404', {
                pageTitle: 'Unauthorized',
                isLoggedIn: req.isLoggedIn,
            });
        }

        // Map product details to order items
        const orderWithDetails = {
            ...order.toObject(),
            orderItems: order.orderItems.map(item => {
                const itemObj = item.toObject ? item.toObject() : item;
                return {
                    ...itemObj,
                    productDetails: item.productId
                };
            })
        };

        const reviewSuccess = req.query.reviewSuccess === 'true';

        res.render('store/orderDetails', {
            pageTitle: 'Order Details',
            order: orderWithDetails,
            isLoggedIn: req.isLoggedIn,
            reviewSuccess: reviewSuccess,
        });
    } catch (error) {
        console.log(error);
        res.render('store/404', {
            pageTitle: 'Error',
            isLoggedIn: req.isLoggedIn,
        });
    }
}

exports.postSubmitReview = async (req, res, next) => {
    try {
        const { productId, orderId, rating, title, review } = req.body;
        const userId = req.user ? req.user._id : null;

        console.log('Review Submission Data:', { 
            productId, 
            orderId, 
            rating, 
            title,
            review,
            userId,
        });

        if (!userId) {
            console.log('User not logged in');
            return res.redirect('/login');
        }

        // Verify the order belongs to the user
        const order = await Order.findById(orderId);
        if (!order) {
            console.log('Order not found:', orderId);
            return res.redirect(`/order/${orderId}?error=Order not found`);
        }

        if (order.userId.toString() !== userId.toString()) {
            console.log('Unauthorized - User:', userId.toString(), 'Order User:', order.userId.toString());
            return res.redirect('/user?error=Unauthorized');
        }

        // Verify the product is in the order
        const productInOrder = order.orderItems.some(item => {
            return item.productId.toString() === productId.toString();
        });
        
        if (!productInOrder) {
            console.log('Product not in order. ProductId:', productId, 'Order Items:', order.orderItems.map(i => i.productId));
            return res.redirect(`/order/${orderId}?error=Product not found in order`);
        }

        // Check if user already reviewed this product for this order
        const existingReview = await Review.findOne({
            userId: userId,
            productId: productId,
            orderId: orderId
        });

        if (existingReview) {
            // Update existing review
            existingReview.rating = parseInt(rating);
            existingReview.title = title;
            existingReview.review = review;
            const savedReview = await existingReview.save();
            console.log('Review updated successfully:', savedReview._id);
        } else {
            // Create new review
            const newReview = new Review({
                userId: userId,
                productId: productId,
                orderId: orderId,
                rating: parseInt(rating),
                title: title,
                review: review
            });
            const savedReview = await newReview.save();
            console.log('Review created successfully:', savedReview._id);
        }

        return res.redirect(`/order/${orderId}?reviewSuccess=true`);
    } catch (error) {
        console.log('Error submitting review:', error);
        console.log('Error stack:', error.stack);
        return res.redirect('/user?error=Error submitting review');
    }
}