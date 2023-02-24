const { getDB, getDb } = require('../util/database')
const mongodb = require('mongodb')
class User {
    constructor(username, useremail, cart, id) {
        this.username = username;
        this.email = useremail;
        this.cart = cart; //{items:[]}
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
        let cartProductIndex = [];
        cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        let updatedCartItems = [...this.cart.items]
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].qty + 1;
            updatedCartItems[cartProductIndex].qty = newQuantity;
        } else {
            updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), qty: newQuantity });
        }
        // const prod = { items: [{...product, qty: 1 }] };
        const db = getDb();
        const updatedCart = {
            items: updatedCartItems
        };
        return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }

    async getCart() {
        try {
            const db = getDb()
            const prodIds = this.cart.items.map(i => {
                return i.productId;
            })
            const prod = db.collection('products').find({ _id: { $in: prodIds } }).toArray();
            const product = await prod;
            const fullProduct = product.map(p => {
                    return {
                        ...p,
                        qty: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).qty
                    }
                })
                // console.log(fullProduct);
            return fullProduct;



        } catch (err) {
            console.log(`fetching cart error :${err}`);
        }
    }
    deleteCartItem(prodId) {
            const updatedCartItems = this.cart.items.filter(item => {
                return item.productId.toString() !== prodId.toString();
            })
            const db = getDb();
            return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } });
        }
        //--------------- adding orders -----------------
    async addOrder() {
        const db = getDb();
        const cartProducts = await this.getCart();
        const order = {
            items: cartProducts,
            user: {
                _id: new mongodb.ObjectId(this._id),
                name: this.username,
                email: this.email
            }
        }
        await db.collection('orders').insertOne(order);
        const updatedCart = this.cart = { items: [] };
        await db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } })

    }
    getOrders() {
        const db = getDb();
        return db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray()
    }
}




module.exports = User;