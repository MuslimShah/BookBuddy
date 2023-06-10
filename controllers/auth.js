const User=require('../models/user');
const {StatusCodes}=require('http-status-codes');
const bcrypt=require('bcryptjs')
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
//------------ signup --------------
exports.getSignup = async(req, res, next) => {
    const isLoggedIn=req.session.isLoggedIn;
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: isLoggedIn
    });
};

exports.postSignup = async(req, res, next) => {
    const {email,password,confirmPassword}=req.body;
    if(!email ||!password ||!confirmPassword){
        return res.status(StatusCodes.BAD_REQUEST).redirect('/signup')
    }
    //check for existing user
    const existUser=await User.findOne({email});
    if(existUser){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'user already exists'})

    }
    //confirm password ==>
    if(password!== confirmPassword){
        return res.status(StatusCodes.BAD_REQUEST).redirect('/signup')
    }
    //hash password
    const salt =await bcrypt.genSalt(10);
    const hasedPassword=await bcrypt.hash(password,salt);
    //save new user in database
    const user=new User({
        email:email,
        password:hasedPassword,
        cart:{
            items:[]
        }
    })
    await user.save();
    res.redirect('/login');

};