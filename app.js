const path = require("path");
const express = require('express');

const app = express();
const bodyParser = require("body-parser");

const errorsController = require("./controllers/errors");
const sequelize = require("./helper/database");
const Product = require(path.join(__dirname,"models/product"));
const User = require(path.join(__dirname,"models/user"));
const Cart = require(path.join(__dirname,"models/cart"));
const CartItem = require(path.join(__dirname,"models/cart-item"));
const Order = require(path.join(__dirname,"models/order"));
const OrderItem = require(path.join(__dirname,"models/order-item"));


const router = express.Router();

app.set('view engine', 'pug');
app.set ('views','views');

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    User.findByPk(1)
        .then( user=>{
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404);

Product.belongsTo(User,{constraints:true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through: CartItem});
Product.belongsToMany(Cart,{through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});
Product.belongsToMany(Order,{through:OrderItem});



sequelize
    //.sync({force: true})
    .sync()
    .then(result=>{
       return User.findByPk(1);
        //console.log(result);
    })
    .then(user =>{
        if(!user){
           return  User.create({ name: 'Arush', email:'test@test.com'});
        }
        return user;
    })
    .then( user =>{
       return user.createCart();
    })
    .then(cart=>{
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });


