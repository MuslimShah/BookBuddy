var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://0.0.0.0:27017";

const db = (cb) => {
    MongoClient.connect(url).then(result => {
        console.log("connected db=====");
        cb(result)

    }).catch(err => {
        console.log("errorr occured ================" + err);
    })
}
module.exports = db;