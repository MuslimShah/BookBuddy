const path = require('path');
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const connectDb = require('./util/database');
// const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(async(req, res, next) => {
//     const user = await User.findById("63f35cbee875c60488c72f35");
//     req.user = new User(user.username, user.email, user.cart, user._id);

//     next()
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
const start = async() => {
    try {
        console.log(`initializing connection ...`);
        await connectDb(process.env.MONGO_URI)
        app.listen(3000, () => console.log(`connected to port:3000`))
    } catch (error) {
        console.log(error);
    }
}
start()

// db.then(() => {
// const user = new User('ali khan', 'ali@gmail.com', { items: [], qty: 0 });
// user.save();


// }).catch(err => {
//     console.log(err);
// })