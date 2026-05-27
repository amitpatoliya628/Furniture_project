exports.error404 = (req, res, next) => {
    res.render('store/404', {
        pageTitle : 'Page Not Found',
        isLoggedIn : req.isLoggedIn,
    })
}