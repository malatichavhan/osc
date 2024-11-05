const Sequelize = require('sequelize');

const sequelize = require('../helper/database');

const Order = sequelize.define('order',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    /*orderId: {
        type: Sequelize.INTEGER,
        references: {
            model: Order,
            key: "id"
        }
    },
    productId: {
        type: Sequelize.INTEGER,
        references: {
            model: Product,
            key: "id"
        }
    }*/
});

module.exports = Order;