const get500=(req,res,next)=>{
    res
    .status(500)
    .render("500", {
      pageTitle: "Error",
      path: "/500",
      isAuthenticated: req.isLoggedIn,
    });
}
module.exports=get500;