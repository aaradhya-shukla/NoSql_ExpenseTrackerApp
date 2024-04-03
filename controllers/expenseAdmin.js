const Expense = require('../models/expense');

const User = require('../models/user');

const jwt = require('jsonwebtoken');



const aws = require('aws-sdk');

const Download = require('../models/download')

exports.getExpense = async (req,res,next) =>{
    try{
        const id = req.userId.userId;
        const user = await User.findById(id);
        const expenses = await Expense.find({userId:user});
        const row = req.body.rows
        const page = req.query.page;
        console.log(row,page)
        let start = (page-1)*row;
        let end = start + + row;
        console.log(start,end)
        let page_expense = expenses.slice(start,end);
        let haspreviusPage=0;
        let hasnextPage=0;
        if(page-1>0){
            haspreviusPage=page-1
        }
        if(start<expenses.length){
            console.log("yessss")
            hasnextPage=1 + + page;
            console.log('page=',page,"rows=",row,"length:",page_expense.length,page_expense)
            res.status(200).json({expenses:page_expense,user:user,currentPage:page,haspreviusPage:haspreviusPage,hasnextPage:hasnextPage});
        }
        else if (start>expenses.length){
            console.log(end,expenses.length)
            res.status(200).json({expenses:[],user:user,currentPage:page,haspreviusPage:haspreviusPage,hasnextPage:hasnextPage});
        }
        
    }
    catch(err){
        console.log(err)
    }
}

exports.postAddExpense = async (req,res,next) =>{
    let {expense,description,category} = req.body;
    const id = req.userId.userId;
    try{  
        const user = await User.findById(id);
        const exp = await new Expense({
            expense:expense,
            description:description,
            category:category,
            userId:user
        });
        user.totalExpense = user.totalExpense + + expense;
        await user.save();
        await exp.save();
        res.status(200).json({expenses:exp})
    }
    catch(err){
        console.log(err);
    }
    

}

exports.getDeleteExpense = async (req,res,next)=>{
    try{
        const id = req.params.id;
        const userId = req.userId.userId;
        const user = await User.findById(userId)
        const expense = await Expense.findById(id)
        // return console.log(req,user)
        user.totalExpense = user.totalExpense - expense.expense;  
        await user.save();
        const del = await Expense.findByIdAndDelete(id);
        // await del.save();
        res.status(200).json({msg:"successfully deleted"})
    }
    catch(err){
        console.log(err);
    }
}

exports.authenticate = async(req,res,next)=>{
    try{
        const token = req.headers.authurization;
        const id = await jwt.verify(token,'secretkey')
        req.userId=id;
        next(); 
    }
    catch(err){
        console.log(err);
    }
}


async function uploadtoS3(data,FileName){
    try{
        const BUCKET_NAME = process.env.BUCKET_NAME;
        const ACCESS_KEY = process.env.ACCESS_KEY;
        const SECRET_KEY = process.env.AWS_SECRET_KEY;
        const S3 = new aws.S3({
        accessKeyId:ACCESS_KEY,
        secretAccessKey:SECRET_KEY
    });
    var params = {
        Bucket : BUCKET_NAME,
        Key : FileName,
        Body : data,
        ACL : 'public-read'
        }

    return new Promise((resolve,reject)=>{
        S3.upload(params,(err,s3response)=>{
            if(err){
                throw new Error(err)
                reject(err);
            }
            else{
                resolve(s3response.Location)
            }
        })
    }) 
    }
    catch(err){
        console.log(err);
        
    }
    }
    
    
exports.getDownloadLink = async(req,res,next)=>{
    try{
        const userId = req.userId.userId;
        const expense = await Expense.findAll({
            where:{
                userId:userId,
            }
        })
        const stringfiedExpenses = JSON.stringify(expense);
        const FileName = `Expense-Report.txt${req.userId.userId}/${new Date()}`;
        const fileUrl = await uploadtoS3(stringfiedExpenses,FileName);
        const user = await User.findByPk(userId);
        const download = await user.createDownload({
            url:fileUrl
        })
        res.status(200).json({fileUrl,success:true})
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl:'',success:false,err:err})
    }
}

exports.getDownloadHistory=async(req,res,next)=>{
    const userId = req.userId.userId;
    try{
        const downloads = await Download.findAll({
            where:{
                userId:userId,
            }
        })
        res.status(200).json({downloads:downloads});
    }
    catch(err){
        console.log(err)
    }
}