const User = require("../models/user");
const bcrypt  = require("bcryptjs");

exports.getLogin = (req, res, next) => {
            res.render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                isAuthenticated: req.session.IsLoggedIn
            });
};

exports.postLogin= (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

const user = await User.findOne({ where: { email: email } });
if (user === null) {
  console.log('Not found!');
  return res.redirect('/login');
} else {
  console.log(user instanceof User);
  console.log(user.email);

const isMatch = await bcrypt.compare(password, user.password);
            

            
            if (isMatch) {
                req.session.IsLoggedIn = true;
                req.session.user = user;
                req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                });
            }else{
                return res.redirect('/login');
            }
        
}
};

exports.postLogout= (req, res, next) => {
    req.session.destroy((err) =>{
        console.log(err);
        res.redirect('/')
    });
};

exports.getSignup= (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    })
};

exports.postSignup= (req, res, next) => {
 const email = req.body.email;
 const password = req.body.password;
 const confirmPassword = req.body.confirmPassword;


 User.findOne({ where: { email: email } }, (err, user) => {
     if (err) {console.log(err);}
 }).then(user =>{
     if (user) {
         return res.redirect('/signup');
     }
     bcrypt.hash(password,12).then(hash => {
         User.create({password: hash, email: email, cart: {cartItems: []}});
         res.redirect('/login');
     })

 });


};

