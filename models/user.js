const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String 
    },
    email:{
        type: String
    },
    password:{
        type: String 
    },
    totalExpense:{
        type: Number,
        default: 0
    },
    order:{
        orderId: {type:String},
        purchaseId: {type:String},
        status: {type:String}
    },
    isPremium:{
        type: Boolean,
    }
})

module.exports = mongoose.model('user',UserSchema);

// const {Sequelize} = require('sequelize');

// const sequelize = require('../util/database');
// const { type } = require('os');

// const User = sequelize.define('user',{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         autoIncrement:true,
//         primaryKey:true
//     },
//     name:Sequelize.STRING,
//     email:{
//         unique:true,
//         type:Sequelize.STRING
//     },
//     password:Sequelize.STRING,
//     isPremium:{
//         type:Sequelize.BOOLEAN,
//         defaultValue:false
//     },
//     totalExpense:{
//         type:Sequelize.INTEGER,
//         defaultValue:0
//     }

// })

// module.exports = User;
