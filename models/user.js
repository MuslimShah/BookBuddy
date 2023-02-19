const { getDB, getDb } = require('../util/database')
const mongodb = require('mongodb')
class User {
    constructor(username, useremail, cart, id) {
        this.username = username;
        this.email = useremail;
        this.cart = cart; //[{items:}]
        this._id = id;
    }
    save() {
        //saving user in database...
        const db = getDb();
        return db.collection('users').insertOne(this);

    }
    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) });
    };
    addToCart(product) {
        //returns the index of the product in the cart
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        })

        let newQuantity = 1;
        let updatedCartItems = [...this.cart.items]
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].qty + 1;
            updatedCartItems[cartProductIndex].qty = newQuantity;
        } else {
            updatedCartItems.push({ _id: new mongodb.ObjectId(product._id), qty: newQuantity });
        }
        const prod = { items: [{...product, qty: 1 }] };
        const db = getDb();
        const updatedCart = [{
            items: updatedCartItems
        }];
        return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }



}

module.exports = User;