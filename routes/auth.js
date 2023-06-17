const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

//reset passwrord
router.get('/reset', authController.getResetPassword);
//post reset password
router.post('/reset', authController.postResetPassword);
//get new password page
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password/', authController.postNewPassword);



module.exports = router;