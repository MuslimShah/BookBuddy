const mongoose = require('mongoose');
const connectDB = (url) => {
    return mongoose.connect(url);
}
module.exports = connectDB;




// // var MongoClient = require('mongodb').MongoClient;
// 
// /**
//  * using a promise to connect to mongodb
//  */
// let connection;

// const db = new Promise(async(resolve, reject) => {
//     try {
//         const conn = await MongoClient.connect(url);
//         connection = conn.db();
//         console.log(`------ connected to mongodb -------`);
//         return resolve(true);
//     } catch (err) {
//         return reject(`error while connecting to db ${err}`);
//     }


// });

// function getDb() {
//     if (connection) {
//         return connection;
//     } else {
//         throw 'no database found';
//     }
// }
// exports.getDb = getDb;
// exports.db = db;