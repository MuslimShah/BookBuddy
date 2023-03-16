const { Schema, mongoose } = require('mongoose');

/**
 * CREATING A PRODUCT MODEL
 * THE SCHEMA IS JUST THE STRUCTURE OF OUR MODEL
 * |-------------------------------------------|
 * | TITLE | PRICE | DESCRIPTION | I MAGEURL   |
 * |-------------------------------------------|
 * */

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, 'you must provide a title']
    },
    price: {
        type: Number,
        required: [true, 'you must provide the price']
    },
    description: {
        type: String,
        required: [true, 'you must provide description']
    },
    imageUrl: {
        type: String,
        required: [true, 'you must enter an image url']
    }
})

module.exports = mongoose.model('Product', productSchema);



// const { getDb } = require('../util/database');
// const mongodb = require('mongodb');
// class Product {
//     constructor(title, price, imageUrl, description, userId) {
//         this.title = title;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.userId = userId;
//     }
//     async save() {
//         try {
//             // console.log(connection);
//             const db = getDb();
//             const record = db.collection('products').insertOne(this);
//             // console.log(record);


//         } catch (err) {
//             console.log(`error storing data ${err}`);
//         }
//     }
//     static fetchAll() {
//         const db = getDb();
//         try {
//             return db.collection('products').find().toArray();
//         } catch (err) {
//             throw err;
//         }
//     }
//     static findById(prodId) {
//         const db = getDb();
//         return db.collection('products').find({ _id: new mongodb.ObjectId(prodId) }).next();
//     }
//     updateProduct(prodId) {
//         const db = getDb();

//         const product = db.collection('products').updateOne({ _id: new mongodb.ObjectId(prodId) }, { $set: this });
//         console.log(`=========== product updated =======`);
//     }

//     static delteProduct(prodId) {
//         const db = getDb();
//         return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) })

//     }

// }

// module.exports = Product;