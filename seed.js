const mongoose = require('mongoose');
const Customer = require('./models/customer');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/bank', {useNewUrlParser: true, useUnifiedTopology: true})
            .then(()=>{
                console.log("Connection Open!!");
            })
            .catch(err =>{
                console.log("Oh my gawd...an error");
                console.log(err);
            })

const seed = async ()=>{
    // // await Customer.deleteMany({});
    const cust = new Customer({name:'HImanshu', email:'himanshu@gmail.com', curBalance:90000})
    await cust.save();
    console.log(cust);
}


seed();
