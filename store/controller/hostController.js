const Product = require('../model/product');
const mongoose = require('mongoose');


exports.getHostLogin = (req, res, next) => {
    res.render('host/login', {
        pageTitle : 'Host Login',
        isHost : false,
        errors : null,
        oldInput : null,
    });
}

exports.postHostLogin = (req, res, next) => {
    const { email, password } = req.body;

    if(email === 'amit123@gmail.com' && password === '87654321') {
        req.session.isHost = true;
        return req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/host/productList');
        });
    } else {
        res.render('host/login', {
            pageTitle : 'Host Login',
            isHost : false,
            errors : ['Invalid email or password'],
            oldInput : { email }
        });
    }
}

exports.getAddProduct = (req, res, next) => {
    if(!req.isHost) {
        console.log('please login as host to access this page');
        return res.redirect('/host/hostLogin');
    }

    res.render('host/addProduct', {
        pageTitle : 'Add Product',
        isHost : req.isHost,
    })
}

exports.postAddProduct = (req, res, next) => {
    if(!req.isHost) {
        console.log('please login as host to access this page');
        return res.redirect('/host/hostLogin');
    }

    console.log(req.body);
    console.log(req.file);
    if(!req.file){
        return res.status(400).send('No file uploaded');
    }
    const image = req.file.path.replace(/\\/g, '/');

    const { name, price, description, category, stock } = req.body;
    const product = new Product({
        name,
        price,
        description,
        category,
        stock,
        image,
    });
    product.save().then(result => {
        console.log('product Added');
    }).catch(err => {
        console.log('error while inserting product', err);
    });
    res.status(200).redirect('/host/productList');
}

exports.getProductList = (req, res, next) => {
    if(!req.isHost) {
        console.log('please login as host to access this page');
        return res.redirect('/host/hostLogin');
    }

    Product.find().then(products => {
        res.render('host/productList', {
            pageTitle : 'Product List',
            products : products,
            isHost : req.isHost,
        })
    })
}


exports.getProductDetails = (req, res, next) => {
    if(!req.isHost) {
        console.log('please login as host to access this page');
        return res.redirect('/host/hostLogin');
    }

    const productId = req.params.productId;
    
    // Validate if productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(404).render('store/404', {
            pageTitle: 'Product Not Found',
        });
    }
    
    Product.findById(productId).then(product => {
        if(!product){
            console.log('Product not found');
            res.redirect('/shop');
        }
        res.render('host/productDetails', {
            pageTitle : 'Product Details',
            product : product,
            isHost : req.isHost,
        })
    }).catch(err => {
        console.log('error while fetching product details', err);
        res.status(500).render('store/404', {
            pageTitle: 'Error',
            isHost : req.isHost,
        });
    })
}

exports.getEditProduct = (req, res, next) => {
    if(!req.isHost) {
        console.log('please login as host to access this page');
        return res.redirect('/host/hostLogin');
    }

    const productId = req.params.productId;

    Product.findById(productId).then(product => {
        if(!product) {
            console.log('product not found')
        }
        res.render('host/editProduct', {
            pageTitle: 'Edit Product',
            product,
            isHost : req.isHost,
        });
    })

}

exports.postEditProduct = (req, res, next) => {
    if(!req.isHost) {
        console.log('please login as host to access this page');
        return res.redirect('/host/hostLogin');
    }

    const { productId, name, price, description, category, stock, image } = req.body;
    console.log(req.body);
    
    const updateData = {
        name,
        price,
        description,
        category,
        stock,
        image
    }

    if(req.file){
        updateData.image = req.file.path.replace(/\\/g, '/');
    }
    console.log(updateData.image);

    Product.findByIdAndUpdate( 
        productId, 
        updateData, 
        { new: true }
    )
    .then( product => {
        if(!product){
            console.log('product not found!');
        }
        console.log('product updated Successfully');
        res.render('host/productDetails', {
            pageTitle : 'Product Details',
            product,
            isHost : req.isHost,
        })
    }).catch(err => {
        console.log('error while finding product for update', err);
    });
}

exports.postDeleteProduct = async (req, res, next) => {
    if(!req.isHost) {
        console.log('please login as host to access this page');
        return res.redirect('/host/hostLogin');
    }
    const productId = req.body.productId;
    await Product.findByIdAndDelete(productId).then(product => {
        if(!product){
            console.log('product not found');
        }
        console.log('product deleted successfully');
        res.redirect('/host/productList');
    })
}