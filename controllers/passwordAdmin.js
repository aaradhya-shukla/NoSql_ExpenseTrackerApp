const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const brevo = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const ForgotPasswordRequests = require('../models/password');
const path = require('path');

// exports.authenticate = async(req,res,next)=>{
//     try{
//         const token = req.headers.authurization;
//         const id = await jwt.verify(token,'secretkey')
//         const user = await User.findByPk(id.userId);
//         req.user=user;
//         next(); 
//     }
//     catch(err){
//         console.log(err);
//     }
// }

exports.postForgotPassword = async (req,res,next)=>{
    // const tr = await sequelize.transaction();
    // const tr1 = await sequelize.transaction();
    const email = req.body.email
    const user = await User.findOne({email:email});
    const uid = uuidv4()
    // return console.log(user)
    try{
        const pastPasswordRequest = await ForgotPasswordRequests.find({userId:user});
        if (pastPasswordRequest.length>0){
            await pastPasswordRequest[0].destroy()
            // const tr = await tr.commit();
        }
        const newPasswordRequest = await new ForgotPasswordRequests({
            id:uid,
            isActive:true
        })
        newPasswordRequest.save();
        // await tr.commit();
    } 
    catch(err){
    //    await tr.rollback();
       console.log(er)
    }   
    console.log(email)
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;
    //return console.log(process.env.API_KEY)
    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();


    sendSmtpEmail.subject = "My {{params.subject}}";
    sendSmtpEmail.htmlContent = "<html><body><h1>Password Reset</h1><bR><p>{{params.mailBody}}<br>{{params.url}}</p></body></html>";
    sendSmtpEmail.sender = { "name": "Aaradhya", "email": "aaradhya.shukla229@gmail.com" };
    sendSmtpEmail.to = [
    { "email": `${email}`, "name": "sample-name" }
    ];
    sendSmtpEmail.replyTo = { "email": "example@brevo.com", "name": "sample-name" };
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = { "mailBody": "Hello click on the link below to reset your password", "subject": "Request to Reset Password" , "url":`http://localhost:3000/password/resetpassword/${uid}`};


    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
    console.error(error);
    });



}

exports.getPasswordReset = async (req,res,next)=>{
    try{
        const uid = req.params.uid;
        if(uid==='pass.js'){
            return
        }
        console.log('from getPasswordreset>uid',uid)
        const resetReq = await ForgotPasswordRequests.findOne({id:uid});
        if (resetReq.isActive){
            console.log('here>vbvbv')
            res.sendFile(path.join(__dirname,'../public','resetForm.html'),{Headers:{
                uid:uid
            }})
        }
    }
    catch(err){
        console.log(err);
    }
}



exports.postUpdatePassword = async (req,res,next)=>{
    // const tr = await sequelize.transaction();
    // const tr1 = await sequelize.transaction();
    try{
        console.log("here at post update password")
        const {email,newPassword} = req.body;
        const hash = await bcrypt.hash(newPassword,10);
        const user = await User.findOne({email:email});
        user.password = hash
        await user.save();
        const ForgotPassword = await ForgotPasswordRequests.findOne({
            userId:user
        });

        ForgotPassword.isActive = false;
        await ForgotPassword.save()
    }
    catch(err){
        console.log(err)
    }
}