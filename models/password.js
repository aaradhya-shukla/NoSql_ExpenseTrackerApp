const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    id:{
        type:String
    },
    isActive:{
        type: Boolean
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model('forgotPasswordRequest',passwordSchema);
// const { Sequelize } = require("sequelize")

// const sequelize = require('../util/database');

// const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequest',{
//     id:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         unique:true,
//         primaryKey:true
//     },
//     isActive:Sequelize.BOOLEAN
// })

// module.exports = ForgotPasswordRequests;