const path = require('path');
require('dotenv').config()
require('express-async-errors'); //handling errors
const express = require('express');
const pageNotFound = require('./errors/pageNotFound');
const connectDb = require('./util/database');
const User = require('./models/user');
const errors = require('./errors/errors')
const app = express();
//body parser
app.use(express.urlencoded({ extended: false }))
    //setting view and view engine
app.set('view engine', 'ejs');
app.set('views', 'views');
//IMPORTING ROUTES
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.static(path.join(__dirname, 'public')));
//assigning user to request
app.use(async(req, res, next) => {
    const user = await User.findById("6412f40214ce60d8cd34defb");
    req.user = user;
    next()
});
//user routes middlewares
app.use('/admin', adminRoutes);
app.use(shopRoutes);
//errors
app.use(errors)
    //page not found
app.use(pageNotFound);
const start = async() => {
    try {
        console.log(`initializing connection ...`);
        await connectDb(process.env.MONGO_USER)
            //find user in db if not found create one
        const user = await User.findOne();
        if (!user) {
            const newUser = new User({
                name: 'ali',
                email: 'ali@gmail.com',
                cart: {
                    items: []
                }
            });
            newUser.save();
        }
        const PORT = 3000;
        app.listen(PORT, () => console.log(`connected to port:${PORT}`))
    } catch (error) {
        console.log(error);
    }
}
start()