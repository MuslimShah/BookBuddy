exports.pageNotFound = (req, res, next) => {
  res.status(404).render("404.ejs", { pageTitle: "page not found" });
};
