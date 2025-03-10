const path = require("path");
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const errorsController = require("./controllers/errors");
const sequelize = require("./helper/database");
const Product = require(path.join(__dirname, "models/product"));
const User = require(path.join(__dirname, "models/user"));
const Cart = require(path.join(__dirname, "models/cart"));
const CartItem = require(path.join(__dirname, "models/cart-item"));
const Order = require(path.join(__dirname, "models/order"));
const OrderItem = require(path.join(__dirname, "models/order-item"));
const Category = require(path.join(__dirname, "models/category"));
const bodyParser = require("body-parser");
const flash = require("connect-flash");

const options = {
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    user: process.env.DB_USER || 'nodejs',
    password: process.env.DB_PASSWORD || 'nodejs',
    database: process.env.DB_NAME || 'nodejs',
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

const app = express();

const store = new MySQLStore(options);

const router = express.Router();

app.set('view engine', 'pug');
app.set('views', 'views');

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    key: 'session_cookie_name',
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(flash());

app.use((req, res, next) => {
    if (req.session.user) {
        User.findByPk(req.session.user.id)
            .then(user => {
                req.user = user;
                req.user.getOrders().then((orders) => {
                    req.session.orderExists = orders.length > 0 ;
                    next();
                })
            });
    } else {
        next();
    }

});

app.use((req, res, next) => {
    if (req.session.user) {
        User.findByPk(req.session.user.id)
            .then(user => {
                req.user = user;
                req.user.getCart().then(cart => {
                    cart.getProducts().then(products => {
                        req.session.cartExists = products.length > 0 ;
                        next();
                    });
                }).catch(error => {
                    next();
                });
            });
    } else {
        next();
    }
});

app.use((req, res, next) => {
Category.findAll().then(categories => {
    res.locals.menuCategories = categories;
    next();
})
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Category.hasMany(Product);
User.hasMany(Category);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
    .sync({alter: true})
    .then(cart => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });