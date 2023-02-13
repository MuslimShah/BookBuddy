const Sequilize = require("sequelize");
const sequelize = new Sequilize("node_complete", "root", "Root@ali20405", {
    dialect: "mysql",
    host: "localhost",
    logging: false
});
module.exports = sequelize;