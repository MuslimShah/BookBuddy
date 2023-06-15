const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const nodemailer=require('nodemailer');
const bcrypt = require("bcryptjs");
const transporter=nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth:{
    user:process.env.ADMIN_EMAIL,
    pass:process.env.ADMIN_EMAIL_PASS
  }
});


exports.getLogin = async (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    // isAuthenticated: req.isLoggedIn,
    // csrfToken:req.csrfToken()
  });
};
exports.postLogin = async (req, res, next) => {
  //extract email and password
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "all fields are required");
    return res.status(StatusCodes.BAD_REQUEST).redirect("/login");
  }
  //find user by that email
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "no user found with given email");
    return res.status(StatusCodes.UNAUTHORIZED).redirect("/login");
  }
  //compare password
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    req.flash("error", "incorrect password");
    return res.status(StatusCodes.UNAUTHORIZED).redirect("/login");
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};
exports.postLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
};
//------------ signup --------------
exports.getSignup = async (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    // isAuthenticated: isLoggedIn
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).redirect("/signup");
  }
  //check for existing user
  /*
    this finding user code was optional as i already validate email by
    uniqe index but i did so just to follow course instructor
    */
  const existUser = await User.findOne({ email });
  if (existUser) {
    req.flash("error", "user with given email already exists");
    return res.status(StatusCodes.BAD_REQUEST).redirect("/signup");
  }
  //confirm password ==>
  if (password !== confirmPassword) {
    req.flash("error", "password does not match");
    return res.status(StatusCodes.BAD_REQUEST).redirect("/signup");
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hasedPassword = await bcrypt.hash(password, salt);
  //save new user in database
  const user = new User({
    email: email,
    password: hasedPassword,
    cart: {
      items: [],
    },
  });
  await user.save();
//SEND EMAIL TO THE USER
const mailOptions={
  from: process.env.ADMIN_EMAIL, // sender address
  to: email, // list of receivers
  subject: "Welcome User✔", // Subject line
  text: "Congratulations! your account has been created on BookBuddy", // plain text body
}
transporter.sendMail(mailOptions,function(error,info){
  if(error){
    console.log('sending email error');
  }
  else{
    console.log('email sent to the user');
  }
})

  res.redirect("/login");
};
