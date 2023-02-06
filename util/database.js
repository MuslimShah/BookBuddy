const Sequilize = require("sequelize");
const sequelize = new Sequilize("node_complete", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});
module.exports = sequelize;
