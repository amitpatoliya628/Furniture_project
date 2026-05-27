const Product = require('../model/product');
const mongoose = require('mongoose');

exports.getAddProduct = (req, res, next) => {
    res.render('host/addProduct', {
        pageTitle : 'Add Product',
        isLoggedIn : req.isLoggedIn,
    })
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const { name, price, description, category, stock, image } = req.body;
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
    Product.find().then(products => {
        res.render('host/productList', {
            pageTitle : 'Product List',
            products : products,
            isLoggedIn : req.isLoggedIn,
        })
    })
}

exports.getProductDetails = (req, res, next) => {
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
        }
        res.render('host/productDetails', {
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

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId).then(product => {
        if(!product) {
            console.log('product not found')
        }
        res.render('host/editProduct', {
            pageTitle: 'Edit Product',
            product,
            isLoggedIn : req.isLoggedIn,
        });
    })

}

exports.postEditProduct = (req, res, next) => {
    const { productId, name, price, description, category, stock, image } = req.body;
    console.log(req.body);

    Product.findByIdAndUpdate( productId, {
        name, 
        price, 
        description, 
        category, 
        stock, 
        image 
    }, 
    { 
        new: true 
    }).then( product => {
        if(!product){
            console.log('product not found!');
        }
        console.log('product updated Successfully');
        res.render('host/productDetails', {
            pageTitle : 'Product Details',
            product,
            isLoggedIn : req.isLoggedIn,
        })
    }).catch(err => {
        console.log('error while finding product for update', err);
    });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndDelete(productId).then(product => {
        if(!product){
            console.log('product not found');
        }
        console.log('product deleted successfully');
        res.redirect('/host/productList');
    })
}