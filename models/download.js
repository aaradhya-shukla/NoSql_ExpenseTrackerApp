const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DownloadSchema = new Schema({
    url:{
        type: String
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model('download', DownloadSchema);
// const {Sequelize} = require('sequelize');

// const sequelize = require('../util/database');

// const download = sequelize.define('download',{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         autoIncrement:true,
//         primaryKey:true
//     },
//     url:Sequelize.STRING,

// })

// module.exports = download;