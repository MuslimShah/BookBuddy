const User=require('../models/user');
const {StatusCodes}=require('http-status-codes');
const bcrypt=require('bcryptjs')
exports.getLogin = async(req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.isLoggedIn
    });
};
exports.postLogin = async(req, res, next) => {
    //extract email and password
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).redirect('/signup');
    }
    //find user by that email
    const user =await User.findOne({email});
    if(!user){
        return res.status(StatusCodes.UNAUTHORIZED).redirect('/signup');
    }
    //compare password
    const isMatched=await bcrypt.compare(password,user.password);
    if(!isMatched){
        return res.status(StatusCodes.UNAUTHORIZED).redirect('/signup');
    }
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
    /*
    this finding user code was optional as i already validate email by
    uniqe index but i did so just to follow course instructor
    */
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