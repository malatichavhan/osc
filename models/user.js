const Sequelize = require("sequelize");

const sequelize = require('../helper/database')

const User = sequelize.define('user', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    password: Sequelize.STRING,
    email: Sequelize.STRING,
    authority: Sequelize.STRING,
    resetPasswordHash: Sequelize.STRING
});

module.exports = User;