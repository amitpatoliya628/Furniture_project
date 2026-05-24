const Product = require('../model/product');

exports.getAddProduct = (req, res, next) => {
    res.render('host/addProduct', {
        pageTitle : 'Add Product',
    })
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const { productName, productPrice, productDescription, productCategory, productSubCategory, productImage } = req.body;
    const product = new Product({
        productName,
        productPrice,
        productDescription,
        productCategory,
        productSubCategory,
        productImage,
    });
    product.save().then(result => {
        console.log('product Added');
    }).catch(err => {
        console.log('error while inserting product', err);
    });
    res.status(200).redirect('/host/addProduct');
}
