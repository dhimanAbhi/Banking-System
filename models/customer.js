const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer = new Schema({
    name: {
        type:String,
        require:true
    },
    email: {
        type:String, 
        required:true, 
        unique:true
    },
    curBalance: {
        type:Number,
        required:true
    }
});



module.exports = mongoose.model('Customer', Customer);