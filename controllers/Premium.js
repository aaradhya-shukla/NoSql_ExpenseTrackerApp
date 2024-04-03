
const User = require('../models/user');

const Razorpay = require('razorpay');

const jwt = require('jsonwebtoken');




exports.createPurchaseOrder = async (req,res,next)=>{
        try{
            const user = req.user;
            var rzp = new Razorpay({
                key_id:process.env.Razorpay_key_id,
                key_secret:process.env.Razorpay_key_secret
            })
            console.log(rzp)
            const amount = 4500;
            const result = await rzp.orders.create({amount:amount,currency:'INR'}, async (err,order)=>{
                if (err){
                    throw new Error(JSON.stringify(err));
                }
                try{
                    
                    const order_item ={
                        orderId:order.id,
                        status:'PENDING'
                    };
                    user.order = order_item;
                    await user.save();
                    res.status(201).json({order, key_id:rzp.key_id});
                }
                catch(err){
                    console.log(err);
                }
                
            })
        }
        catch(err){
            console.log(err)
        }
}

exports.authenticate = async(req,res,next)=>{
    try{
        const token = req.headers.authurization;
        const id = await jwt.verify(token,'secretkey')
        const user = await User.findById(id.userId);
        req.user=user;
        next(); 
    }
    catch(err){
        console.log(err);
    }
}

exports.postUpdatePaymentStatus= async(req,res,next)=>{

    try{
        
        const order_id= req.body.orderId;
        const payment_id = req.body.paymentId;
        const status = req.body.status;
        const user = req.user;
        
        const order = user.order
        order.purchaseId = payment_id;
        order.status = status;
        await user.save();
        if (status!="FAILED"){
            user.isPremium=true
            await user.save();
            res.status(201).json({msg:'success'});
        }
        else{
            user.isPremium=false
            await user.save();
            res.status(500).json({msg:'failed'});
        }
    }
    catch(err){
        console.log(err)
    }
}

exports.getLeaderBoard = async (req,res,next)=>{
    try{
        const user = req.user;
        const users = await User.find()
        .select('name totalExpense')
        .sort({'totalExpense': 'desc'})
        console.log('here',users);
        res.status(200).json({users:users});
    }
    catch(err){
        console.log(err)
    }
}