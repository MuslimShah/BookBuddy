const express = require("express");
const path=require('path')
const adminRoutes = require('./routes/admin');
const shopRoutes = require("./routes/shop");
const sequelize = require('./util/database');
// const pageNotFound = require('./routes/404')
// ==> error controller
const errorController = require('./controllers/error')
const Product = require('./model/product');
const User = require("./model/user");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))
// ==> set view

app.set('view engine', 'ejs');
app.set('views','views')



app.use("/admin", adminRoutes);
app.use(shopRoutes);
//==> PAGE NOT FOUND...
app.use(errorController.pageNotFound);


sequelize.sync().then((result) => {
  // console.log(result);
  app.listen(3000, function () {
    console.log("got connected to :3000");
  });
}).catch(err => {
  console.log(err);
})





