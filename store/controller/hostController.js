const Product = require('../model/product');

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
