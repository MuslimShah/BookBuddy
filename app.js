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
const get500=require('./errors/500')
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash=require('connect-flash');
const store = new MongoDBStore({
  uri: process.env.MONGO_USER,
  collection: "sessions",
});
// Catch errors
store.on("error", function (error) {
  console.log("----session error --" + error);
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
//using csruf package to avoid csrf attacts
//CSRG==>cross site request forgery attack
//in which the attacker can missuse your session
//IMPORTING ROUTES
app.use(csrf());
//use flash to store error to session for a while 
app.use(flash());
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(express.static(path.join(__dirname, "public")));
//assigning user to request
// app.use(async (req, res, next) => {
//   if (!req.session.user) {
//     // req.isLoggedIn=req.session.isLoggedIn;
//     return next();
//   }
//   req.isLoggedIn=req.session.isLoggedIn;
//   next()

// });
//local variable passed to views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
// //user routes middlewares
app.use("/admin", adminRoutes);
app.use(shopRoutes);
//auth routes
app.use(authRoutes);
//error route
app.get('/500',get500)
//errors
app.use(errors);
//page not found
app.use(pageNotFound);

//starting server
const start = async () => {
  try {
    console.log(`initializing connection ...`);
    await connectDb(process.env.MONGO_USER);
    const PORT = 3000;
    app.listen(PORT, () => console.log(`connected to port:${PORT}`));
  } catch (error) {
      throw new Error("cannot connect to database")
  }
};
start();
