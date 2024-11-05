const Sequelize = require('sequelize');

const sequelize = require('../helper/database');
const Cart = require("./cart");
const Product = require("./product");


const CartItem = sequelize.define('cartItem',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER,
    cartId: {
        type: Sequelize.INTEGER,
            references: {
            model: Cart,
                key: "id"
        }
    },
    productId: {
        type: Sequelize.INTEGER,
        references: {
            model: Product,
            key: "id"
        }
    }
});

module.exports = CartItem;