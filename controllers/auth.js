exports.getLogin = async(req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];
    const isLoggedIn=req.session.isLoggedIn;
    console.log(isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
};
exports.postLogin = async(req, res, next) => {
    req.session.isLoggedIn=true;
    res.redirect('/')

};