const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Cart = require("../models/cart");

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.IsLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ where: { email: email } }, (err, user) => {
        if (err) { console.log(err); }
        return res.redirect('/login');
    }).then(user => {
        if (!user) {
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) { return res.redirect('/login'); }
            if (isMatch) {
                req.session.IsLoggedIn = true;
                req.session.user = user;
                Cart.create({userId:user.id});
                req.session.save((err) => {
                    return res.redirect('/');
                });
            } else {
                return res.redirect('/login');
            }
        });
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/')
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    })
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;


    User.findOne({ where: { email: email } }, (err, user) => {
        if (err) { console.log(err); }
    }).then(user => {
        if (user) {
            return res.redirect('/signup');
        }
        bcrypt.hash(password, 12).then(hash => {
            User.create({ password: hash, email: email, cart: { cartItems: [] } });
            res.redirect('/login');
        });
    });

};