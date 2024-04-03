const { connect } = require('http2');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const brevo = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');

exports.postSignUp=async (req,res,next)=>{
    try{       
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        const hash = await bcrypt.hash(password,10)
        const user = await new User({
            name:name,
            email:email,
            password:hash
        });
        await user.save();
        res.status(200).json({msg:"successfully signed in"});
    }
    catch(err){
        if (err.name==="SequelizeUniqueConstraintError"){
            res.status(500).json({msg:'user email id already exists'})
        }
        // await tr.rollback();
        console.log(err)
    }
}

function generateToken(id){
    return jwt.sign({userId:id},'secretkey');
}

exports.postLogin= async (req,res,next)=>{
    try{
        let email = req.body.email;
        let password = req.body.password;
        const user = await User.findOne({email:email});
        if (user){
            const hash = await bcrypt.compare(password,user.password)
            if (!hash){
                return res.status(401).json({msg:'wrong password'});
            }
            else{
                return res.status(200).json({userid:user,token:generateToken(user._id)});
            }
            
        }
        res.status(404).json({msg:'user not found'});
    }
    catch(err){
        console.log(err);
    }
}

