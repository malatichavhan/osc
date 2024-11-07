const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME || 'nodejs', process.env.DB_USER || 'nodejs' , process.env.DB_PASSWORD || 'nodejs',{
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST || 'localhost'
});

module.exports = sequelize;
