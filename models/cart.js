const Sequelize = require('sequelize');

const sequelize = require('../helper/database');
const User = require("./user");

const Cart = sequelize.define('cart',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "id"
    }
  }
});

module.exports = Cart;