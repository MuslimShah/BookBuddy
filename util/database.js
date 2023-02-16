var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://0.0.0.0:27017/shopDb";
/**
 * using a promise to connect to mongodb
 */
let connection;

const db = new Promise(async(resolve, reject) => {

    try {
        const conn = await MongoClient.connect(url);
        // console.log(conn);
        // console.log(conn.db());
        connection = conn.db();
        console.log(`------ connected to mongodb -------`);
        return resolve(true);

    } catch (err) {
        return reject(`error while connecting to db ${err}`);
    }


});

function getDb() {
    if (connection) {
        return connection;
    } else {
        throw 'no database found';
    }
}
exports.getDb = getDb;
exports.db = db;