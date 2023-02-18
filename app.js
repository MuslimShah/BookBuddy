const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const { db } = require('./util/database');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     // User.findById(1)
//     //   .then(user => {
//     //     req.user = user;
//     //     next();
//     //   })
//     //   .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
db.then(() => {
    const user = new User('ali khan', 'ali@gmail.com');
    user.save();
    app.listen(3000, () => console.log(`connected to port:3000`))

}).catch(err => {
    console.log(err);
})