var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://0.0.0.0:27017";

const db = new Promise(async(resolve, reject) => {

    try {
        const conn = await MongoClient.connect(url);
        console.log(`------connected to mongodb-------`);
        return resolve(conn)

    } catch (err) {
        return reject(`error while connecting to db ${err}`);
    }


});
module.exports = db;