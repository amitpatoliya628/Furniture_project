const Product = require('../model/product');
const mongoose = require('mongoose');

exports.getAddProduct = (req, res, next) => {
    res.render('host/addProduct', {
        pageTitle : 'Add Product',
    })
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const { name, price, description, category, subCategory, image } = req.body;
    const product = new Product({
        name,
        price,
        description,
        category,
        subCategory,
        image,
    });
    product.save().then(result => {
        console.log('product Added');
    }).catch(err => {
        console.log('error while inserting product', err);
    });
    res.status(200).redirect('/host/addProduct');
}

exports.getProductList = (req, res, next) => {
    Product.find().then(products => {
        res.render('host/productList', {
            pageTitle : 'Product List',
            products : products,
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
        })
    }).catch(err => {
        console.log('error while fetching product details', err);
        res.status(500).render('store/404', {
            pageTitle: 'Error',
        });
    })
}