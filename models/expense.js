const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    expense:Schema.Types.Number,
    description:Schema.Types.String,
    category:Schema.Types.String,
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model('expense',ExpenseSchema);


// const {Sequelize} = require('sequelize');

// const sequelize = require('../util/database');


// const Expense = sequelize.define('expense',{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         autoIncrement:true,
//         primaryKey:true
//     },
//     expense:Sequelize.INTEGER,
//     description:Sequelize.STRING,
//     category:Sequelize.STRING,
// })

// module.exports = Expense;