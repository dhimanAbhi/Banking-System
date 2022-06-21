const mongoose = require('mongoose');
const customer = require('./customer');
const Schema = mongoose.Schema;

const Transfer = new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:'Customer',
    },
    receiverId:{
        type:Schema.Types.ObjectId,
        ref:'Customer',
    },

    senderName:String,

    receiverName:String,
    
    transferAmount:{
        type:Number,
        default:0
    },
    transferSuccess:{
        type:Boolean,
        default:false
    },
    dateAndTime:{
        type:String,
        unique:true
    }
});

module.exports = mongoose.model('Transfer', Transfer);