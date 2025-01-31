const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Cart = require("../models/cart");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'malatirathod1111@gmail.com',
        pass: 'gejv gkbl srdk yvei'
    }
});

exports.getLogin = (req, res, next) => {
    let massage =req.flash('error');
    if(massage.length > 0){
      massage = massage[0];
    }else {
        massage = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.IsLoggedIn,
        errorMassage: massage
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ where: { email: email } }, (err, user) => {
        if (err) { console.log(err); }
        req.flash('error', 'please enter a valid email and password.');
        return res.redirect('/login');
    }).then(user => {
        if (!user) {
            req.flash('error', 'invalid email or password.');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) { return res.redirect('/login'); }
            if (isMatch) {
                req.session.IsLoggedIn = true;
                req.session.user = user;
                req.session.isAdmin = user.authority==='ADMIN';
                Cart.create({userId:user.id});
                req.session.save((err) => {
                    if (req.session.isAdmin){
                        return res.redirect('/admin/products');
                    }else{
                        return res.redirect('/');
                    }
                });
            } else {
                req.flash('error', 'password is incorrect.');
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

exports.getForgetPassword = (req, res, next) => {
    const email = req.body.email;
    let massage =req.flash('error');
    if(massage.length > 0){
        massage = massage[0];
    }else {
        massage = null;
    }
    res.render('auth/forgetpassword', {errorMassage: massage})
};

exports.postSendEmail = (req, res, next) => {
    const email = req.body.email;

    User.findOne({ where: { email: email } }, (err, user) => {
        if (err) { console.log(err); }
        req.flash('error', 'Your account does not exist.');
        return res.redirect('/forgetpassword');
    }).then(user => {
        if (!user) {
            req.flash('error', 'Your account does not exist.');
            return res.redirect('/forgetpassword');
        }else {
            bcrypt.hash(email, user.id).then(hash => {
                //Sending email
            user.resetPasswordHash=hash;
            user.save();
                const mailOptions = {
                    from: 'malatirathod1111@gmail.com',
                    to: email,
                    subject: 'Password Reset For themalati.com',
                    text: 'Click the link to reset password https://themalati.com/resetpassword/'+hash.replaceAll("/","%2F")
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                //Sending email finished
            });

            res.render('auth/sendemail', {})
        }
    });


};

exports.getResetPassword = (req, res, next) => {
    const hash = req.params.hash;
    User.findOne({ where: { resetPasswordHash: hash } }, (err, user) => {
        if (err) { console.log(err); }
        req.flash('error', 'Invalid Or expired link for password reset.');
        return res.redirect('/forgetpassword');
    }).then(user => {
        if (!user) {
            req.flash('error', 'Invalid Or expired link for password reset.');
            return res.redirect('/forgetpassword');
        }else {
            res.render('auth/resetpassword', {hash:hash});
        }
    });

};

exports.postUpdatepassword = (req, res, next) => {
    const password = req.body.password;
    const hash = req.body.hash;
    User.findOne({ where: { resetPasswordHash: hash } }, (err, user) => {
        if (err) { console.log(err); }
        req.flash('error', 'Invalid Or expired link for password reset.');
        return res.redirect('/forgetpassword');
    }).then(user => {
        if (!user) {
            req.flash('error', 'Invalid Or expired link for password reset.');
            return res.redirect('/forgetpassword');
        }else {

            bcrypt.hash(password, 12).then(hash => {
                user.resetPasswordHash=null;
                user.password=hash;
                user.save();
                res.redirect('/login')
            });


        }
    });


};

