const Sequelize = require('sequelize');

const sequelize = require('../helper/database');
const User = require("./user");

const Order = sequelize.define('order',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount: Sequelize.DOUBLE,
    userId: {
        type: Sequelize.INTEGER,
        references: {
        model: User,
            key: "id"
    }
}
});

module.exports = Order;