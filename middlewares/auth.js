const User=require('../models/user')
const auth = async(req, res, next) => {
  if (!req.session.isLoggedIn) {
    console.log(req.session.isLoggedIn)
    return res.redirect("/login");
  }
  const user = await User.findById(req.session.user._id);
  req.user = user;
  console.log(user)
  req.isLoggedIn = true
  next();
//   req.user = req.session.user;
//   req.isLoggedIn = req.session.isLoggedIn;
//   console.log(req.isLoggedIn)
//   next();
};
module.exports = auth;
