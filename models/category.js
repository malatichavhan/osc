const Sequelize = require('sequelize');
const sequelize = require('../helper/database');
const User = require("./user");

const Category = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    description : Sequelize.STRING,
});
module.exports = Category;

