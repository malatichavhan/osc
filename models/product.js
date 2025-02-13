const Sequelize = require("sequelize");

const sequelize =require("../helper/database");
const User = require("./user");
const Category = require("./category");

const Product = sequelize.define('product',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,

},
  title: Sequelize.STRING,
    price:{
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
  imageUrl:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  description:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "id"
    }
  },
  categoryId: {
    type: Sequelize.INTEGER,
    references: {
      model: Category,
      key: "id"
    }
  },
  quantity:{
    type: Sequelize.INTEGER,
    allowNull: true
  },


});

module.exports = Product;
