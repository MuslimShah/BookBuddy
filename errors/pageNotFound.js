const pageNotFound = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404',isAuthenticated:req.isLoggedIn });
};
module.exports = pageNotFound