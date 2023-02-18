const { getDB, getDb } = require('../util/database')
const mongodb = require('mongodb')
class User {
    constructor(username, useremail) {
        this.username = username;
        this.email = useremail;
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



}

module.exports = User;