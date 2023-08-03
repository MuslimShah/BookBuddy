const errors = (err, req, res, next) => {
  let customError = {
    statusCode: 500,
    msg: err || "something crashed !",
  };
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.isLoggedIn,
    Error:customError
  });
};
module.exports = errors;
