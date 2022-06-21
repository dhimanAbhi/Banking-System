const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const ejs = require('ejs');
const mongoose = require('mongoose');
const Customer = require('./models/customer');
const Transfer = require('./models/transfer');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session')
const dbUrl = process.env.DB_URL;
// mongodb://localhost:27017/bank
mongoose.connect("mongodb+srv://abhi2002dhi:nidhidhiman@cluster0.kp6ro.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected")
})


app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const sessionOptions = {secret: 'thisisnotagoodsecret', resave: false , saveUninitialized: true}
app.use(session(sessionOptions));

app.use(flash());

app.use((req, res, next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', async (req,res) => {
    res.render('home');
})

app.get('/bank/viewCustomers', async (req,res) => {
    const allCust = await Customer.find({});
    res.render('customers', {allCust});
})

app.get('/bank/viewCustomer/:id', async (req, res) => {
    const cust = await Customer.findById(req.params.id);
    res.render('viewCustomer', {cust});
})

app.get('/bank/viewTransactions', async (req, res) =>{
    const transactions = await Transfer.find({});
    console.log(transactions);
    res.render('transactions',{transactions});
})

app.get('/bank/:id/transferMoney', async (req, res) => {
    const id = req.params.id;
    const allCust = await Customer.find({});
    res.render('transferMoney', {allCust, id});
})

app.get('/bank/:id/transferMoney', async (req, res) => {
    const id = req.params.id;
    const allCust = await Customer.find({});
    res.render('transferMoney', {allCust, id});
})

app.post('/bank/:senderId/transferMoney', async (req, res) => {
    const {amount, receiverId} = req.body;
    const sender = await Customer.findById(req.params.senderId);
    const receiver = await Customer.findById(receiverId);
    const now = new Date();

    const transfer = await new Transfer({
        senderId:req.params.senderId,
        receiverId,
        senderName:sender.name,
        receiverName:receiver.name,
        transferAmount:amount,
        transferSuccess:true,
        dateAndTime:now
    });

    if(sender.curBalance >= amount){
        sender.curBalance = parseFloat(sender.curBalance - parseFloat(amount));
        receiver.curBalance = parseFloat(receiver.curBalance + parseFloat(amount));
        await sender.save();
        await receiver.save();
        await transfer.save();
        console.log('Transfer Successful');
        req.flash('success','Transfer Successful');
        res.redirect('/bank/viewCustomers');
    }

    else{
        transfer.transferSuccess=false;
        await transfer.save();
        console.log("Not enough balance in your account!");
        req.flash('error','Not enough balance in your account!');
        res.redirect(`/bank/${req.params.senderId}/transferMoney`);
    }
    
    
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});


