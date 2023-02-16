const { getDb } = require('../util/database');
class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description
    }
    async save() {
        try {
            // console.log(connection);
            const db = getDb();
            const record = db.collection('products').insertOne(this);
            // console.log(record);


        } catch (err) {
            console.log(`error storing data ${err}`);
        }
    }
}

module.exports = Product;