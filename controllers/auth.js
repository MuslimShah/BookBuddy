const {validationResult}=require('express-validator')

const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
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
//testing validation
const result=validationResult(req);
if(!result.isEmpty()){
    const error=result.array()[0].msg
    return res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: error,
      // isAuthenticated: req.isLoggedIn,
      // csrfToken:req.csrfToken()
    });
}


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
    oldInput:{
      email:"",
      password:"",
      confirmPassword:""
    },
    validationError:[]
    
  });
};

exports.postSignup = async (req, res, next) => {
  //recieving inputs
  const { email, password, confirmPassword } = req.body;
//testing validation
const validResult=validationResult(req);
if(!validResult.isEmpty()){
    const error=validResult.array()[0].msg
    return res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: error,
      oldInput:{
        email:email,
        password:password,
        confirmPassword:confirmPassword
      },
      validationError:validResult.array()

    });
}
 
  if (!email || !password || !confirmPassword) {
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
  const mailOptions = {
    from: process.env.ADMIN_EMAIL, // sender address
    to: email, // list of receivers
    subject: "Welcome User✔", // Subject line
    text: "Congratulations! your account has been created on BookBuddy", // plain text body
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("sending email error");
    } else {
      console.log("email sent to the user");
    }
  });

  res.redirect("/login");
};

//get reset password
exports.getResetPassword = async (req, res, next) => {
  let message = req.flash("error");
  console.log(message);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/resetPass", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
    // isAuthenticated: isLoggedIn
  });
};

//post resest password
exports.postResetPassword = async (req, res, next) => {
  //recieve email
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    req.flash("error", "no user found with given email");
    return res.redirect("/reset");
  }
  //
  const rand = await crypto.randomBytes(32);
  const token = rand.toString("hex");
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 900000;
  await user.save();
  //-------------- send reset email to user ============
  const mailOptions = {
    from: process.env.ADMIN_EMAIL, // sender address
    to: email, // list of receivers
    subject: "Password Reset Email", // Subject line
    html: `<html lang="en">  
              <body>
                 <p>you requested a password reset</p>
                 <p>click this <a href="http://localhost:3000/reset/${token}">link</a> to reset the password</p>
                 <p>If this was not you ignore this email</p>
               </body>
           </html>`,
  };



  
  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log("sending email error");
      return res.redirect("/reset");
    } else {
      console.log("email sent to the user",info.response);
      req.flash("error", "email sent to the user");    
    }
  });
  res.redirect("/reset");
};

//render new password page

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  let message = req.flash("error");
  //find user with the token
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    req.flash("error", "no user found with given token");
    return res.redirect("/reset");
  }

  if (message.length > 0) {
    message = message[0];
  } else { 
    message = null;
  }

  res.render("auth/new-password", {
    path: "/new-password",
    pageTitle: "Update Password",
    errorMessage: message,
    userId: user._id.toString(),
    token: token,
  });
};

//update user password in
exports.postNewPassword = async (req, res, next) => {
  const { password, confirmPassword, userId, token } = req.body;
  if (!password || !confirmPassword) {
    req.flash("error", "all fields are required");
    return res.redirect(`/reset`);
  }
  if (password !== confirmPassword) {
    req.flash("error", "passwords does not match");
    return res.redirect("/reset");
  }
  const user = await User.findOne({
    _id: userId,
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    req.flash("error", "link expired");
    return res.redirect("/reset");
  } 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();
  res.redirect("/login");
};
