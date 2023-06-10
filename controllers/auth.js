const User=require('../models/user')
exports.getLogin = async(req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];
    const isLoggedIn=req.session.isLoggedIn;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
};
exports.postLogin = async(req, res, next) => {
   
    const user = await User.findById("6416f458688fdee19f465065");
    req.session.isLoggedIn=true;  
    req.session.user=user;
    await req.session.save();
    res.redirect('/')

};
exports.postLogout = async(req, res, next) => {
   await req.session.destroy();
    res.redirect('/')

};