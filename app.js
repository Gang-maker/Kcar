const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const compression = require('compression');
const fs = require('fs');
const electricRouter = require('./routes/electric_index');
const gasRouter = require('./routes/gas_index');
const adminRouter = require('./routes/admin');
var UserModel = require("./models/CustomerModel");
const app = express();

app.engine('.hbs', exphbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        json: function(context) {
            return JSON.stringify(context);
        },
        range: function(start, end, options) {
            let accum = '';
            for (let i = start; i < end; ++i) {
                accum += options.fn(i);
            }
            return accum;
        },
        add: (a, b) => a + b,
        multiply: (a, b) => a * b,
        lt: (a, b) => a < b,
        gt: (a, b) => a > b,           // <-- Add this line
        subtract: (a, b) => a - b,     // <-- Add this line
        includes: (array, value) => Array.isArray(array) && array.includes(value),
        eq: (a, b) => a == b
    }
}));

app.set('view engine', '.hbs');

// Connecting to Mongodb
const db = async () => {
    try {
        await mongoose.connect('mongodb+srv://carvision467:TP73jaGTAGnsYmW7@cluster0.az4u98g.mongodb.net/autorizz?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.log("MongoDB Error : Failed to connect");
        console.log(err);
        process.exit(1);
    }
}
db();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use('/electric', electricRouter);

// Mount routers only once
app.use('/electric', electricRouter);
app.use('/admin', adminRouter);
app.use('/gas', gasRouter);

// Routing
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', function (req, res) {
    res.sendFile(__dirname + "/routes/home.html");
});

// Users
app.post('/customer', async (req, res) => {
    const user = new UserModel({
        name: req.body.username,
        email: req.body.useremail,
        phone: req.body.userphone
    })
    const user_res = await user.save();
    console.log(user_res);
    res.status(201).json(user_res); // Respond to client
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;