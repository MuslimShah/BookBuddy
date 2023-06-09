const path = require("path");
require("dotenv").config();
require("express-async-errors"); //handling errors
const express = require("express");
const pageNotFound = require("./errors/pageNotFound");
const connectDb = require("./util/database");
const User = require("./models/user");
const errors = require("./errors/errors");
const cookeParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_USER,
  collection: "sessions",
});
// Catch errors
store.on("error", function (error) {
  console.log("----session error --"+error);
});

const app = express();
//body parser
app.use(express.urlencoded({ extended: false }));

//handling sessions
app.use(
  session({
    secret: "dxdiagjkdlafj",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
//setting view and view engine
app.set("view engine", "ejs");
app.set("views", "views");
app.use(cookeParser());
//IMPORTING ROUTES
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(express.static(path.join(__dirname, "public")));
//assigning user to request
app.use(async (req, res, next) => {
  const user = await User.findById("6416f458688fdee19f465065");
  req.user = user;
  next();
});
//user routes middlewares
app.use("/admin", adminRoutes);
app.use(shopRoutes);
//auth routes
app.use(authRoutes);
//errors
app.use(errors);
//page not found
app.use(pageNotFound);

//starting server
const start = async () => {
  try {
    console.log(`initializing connection ...`);
    await connectDb(process.env.MONGO_USER);
    //find user in db if not found create one
    const user = await User.findOne();
    if (!user) {
      const newUser = new User({
        name: "ali",
        email: "ali@gmail.com",
        cart: {
          items: [],
        },
      });
      newUser.save();
    }
    const PORT = 3000;
    app.listen(PORT, () => console.log(`connected to port:${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();
