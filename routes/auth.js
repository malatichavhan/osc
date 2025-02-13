const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout)
router.post('/signup', authController.postSignup);
router.get('/signup', authController.getSignup);
router.get('/forgetpassword', authController.getForgetPassword);
router.post('/sendemail', authController.postSendEmail);
router.get('/resetpassword/:hash', authController.getResetPassword);
router.post('/updatepassword',authController.postUpdatepassword);




module.exports = router;