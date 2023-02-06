const Sequilize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequilize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey:true
  },
  price: {
    type: Sequilize.DOUBLE,
    allowNull:false
  },
  title:Sequilize.STRING,
  imageUrl: {
    type: Sequilize.STRING,
    allowNull:false
  },
  description: {
    type: Sequilize.STRING,
    allowNull:false
  }
})

module.exports = Product;