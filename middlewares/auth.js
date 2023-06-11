const User=require('../models/user')
const auth = async(req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  const user = await User.findById(req.session.user._id);
  req.user = user;
  next();
};
module.exports = auth;
