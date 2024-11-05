const Sequelize = require('sequelize');

const sequelize = require('../helper/database');

const OrderItem = sequelize.define('orderItem',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER,
    /*orderId: {
        type: Sequelize.INTEGER,
        references: {
            model: OrderItem,
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

module.exports = OrderItem;