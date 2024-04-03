const express = require('express');

const router = express.Router();

const PasswordAdmin = require('../controllers/passwordAdmin');

router.post('/forgotpassword',PasswordAdmin.postForgotPassword)

router.post('/Updatepassword',PasswordAdmin.postUpdatePassword)

router.get('/resetpassword/:uid',PasswordAdmin.getPasswordReset)

module.exports=router;