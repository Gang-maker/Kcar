const express = require('express');
const router = express.Router();
const multer = require('multer');
const ElectricModel = require("../models/ElectricModel");
const GasModel = require('../models/GasModel');
const ServiceModel = require('../models/ServiceModel');
const CustomerModel = require('../models/CustomerModel');
const UserModel = require("../models/UserModel");
const sendEmail = require("../utils/mailer");
const bcrypt = require('bcrypt');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const path = require('path');
const fs = require('fs');


router.use(express.static("public"));



// GET Root Route - Admin login
router.get('/', function (req, res) {
    res.sendFile(__dirname + "/login.html");
});
// Get Add electric Cars Form Page
router.get('/addelectric', (req, res) => {
    const optionsPath = path.join(__dirname, '../data/dropdownOptions.json');
    const dropdownOptions = JSON.parse(fs.readFileSync(optionsPath, 'utf8'));
    res.render("admin/electric_form", { layout: false, dropdownOptions });
});

// GET Login Error
router.get('/login_error', function (req, res) {
    res.sendFile(__dirname + "/loginerror.html");
});

// POST Admin login
router.post("/login", async function (req, res) {
    let id = req.body.userid;
    let pass = req.body.password;

    // Hardcoded check for testing only
    if (id === "Felix" && pass === "carvision") {
        console.log("Login Success (hardcoded)");
        res.redirect("home");
    } else {
        // Fallback to database check
        let user = await UserModel.findOne({ name: id });
        if (user && await bcrypt.compare(pass, user.password)) {
            console.log("Login Success (db)");
            res.redirect("home");
        } else {
            res.redirect("login_error");
        }
    }
});




// GET - Home Page
router.get('/home', function (req, res) {
    res.sendFile(__dirname + "/admin_home.html");
});



// GET Service Page
router.get('/service', async function (req, res) {

    let servicecars = await ServiceModel.find();
    console.log(servicecars);
    res.render("admin/service.hbs", { servicecars: servicecars, layout: false });

});

// GET send email
router.get('/service/email/:mailid', async function (req, res) {

    var client_email = req.params.mailid;
    var mail_status = await sendEmail(client_email);
    console.log("Email Status - " + mail_status);
    res.redirect('/admin/service');
});



//GET Admin Index
router.get('/admin_index', async function (req, res) {
    res.render("admin/admin_index", { layout: false });
});


// GET Electric Cars
router.get('/electric', async function (req, res) {

    let electric_models = await ElectricModel.find();
    res.render("admin/electric_list", { list: electric_models, layout: 'layout_list' });
});


// Get Add electric Cars Form Page
router.get('/addelectric', (req, res) => {
    res.render("admin/electric_form", { layout: false });
});




router.post('/addelectric', upload.array('imageupld', 10), async function (req, res) {
    // req.files is an array of uploaded files
    const imagePaths = req.files.map(file => file.path); // Cloudinary URLs

    let electric = new ElectricModel({
        ...req.body,
        imagePaths // Save as an array
    });
    await electric.save();
    res.redirect('/admin/electric');
});

// Delete Electric Car
router.get('/deleteelectric/:id', async function (req, res) {

    const result = await ElectricModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/electric');
});







// GET Gas Cars
router.get('/gas', async function (req, res) {

    let gas_models = await GasModel.find();
    res.render("admin/gas_list", { list: gas_models, layout: 'layout_list' });
});


// Get Add Gas Cars Form Page
router.get('/addgas', (req, res) => {
    res.render("admin/gas_form", { layout: false });
});

// POST Gas Car Form
router.post('/addgas', async function (req, res) {

    let gas = new GasModel(req.body);

    result = await gas.save();
    console.log(result);

    res.redirect('/admin/gas');

});


// Delete Gas Car
router.get('/deletegas/:id', async function (req, res) {

    const result = await GasModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/gas');
});







// GET Customers
router.get('/customers', async function (req, res) {

    let customers = await CustomerModel.find();
    res.render("admin/customers_list", { list: customers, layout: false });
});

// Delete User
router.get('/deletecustomer/:id', async function (req, res) {

    const result = await CustomerModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/customers');
});









// Image Handling

// Get Upload Image Form Page
router.get('/images', (req, res) => {
    res.render("admin/images_upload", { layout: false });
});


// POST Image File
router.post('/uploadimage', (req, res) => {
    upload(req, res, (err) => {

        if (err) {
            img = { err: err };
            console.log(img);
            res.render('admin/images_upload', { img: img, layout: false });
        }
        else {
            if (req.file == undefined) {
                img = { err: "No File Uploaded" }
                res.render('admin/images_upload', { img: img, layout: false });
            }
            else {
                console.log(req.file);
                res.redirect("/admin");
            }
        }

    });

});



module.exports = router;