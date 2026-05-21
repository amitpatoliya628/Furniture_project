exports.getindex = (req, res, next) => {
    res.render('store/index',{
        pageTitle : 'Home Page',
    });
}

exports.getShop = (req, res, next) => {
    res.render('store/shop', {
        pageTitle : 'Shop Page',
    });
}