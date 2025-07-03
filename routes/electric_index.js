const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ElectricModel = require("../models/ElectricModel");
const path = require('path');
const fs = require('fs');

// GET Booked Model
router.get('/booknow/:id', async function (req, res) {
    const modelid = req.params.id;

    let booked_model = null;

    // Try to find by MongoDB ObjectId first
    if (/^[0-9a-fA-F]{24}$/.test(modelid)) {
        booked_model = await ElectricModel.findById(modelid);
    }

  // If not found, try to find in felixCars_en.json by carSeq
if (!booked_model) {
    const dataPath = path.join(__dirname, '../felixCars_en.json'); // <-- use the EN file
    const cars = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    booked_model = cars.find(car => String(car.carSeq) === String(modelid));
    // Normalize images for handlebars
    if (booked_model && booked_model.images) {
        booked_model.imagePaths = booked_model.images;
    }
}

    // Load all options from dropdownOptions.json
    const optionsPath = path.join(__dirname, '../data/dropdownOptions.json');
    const dropdownOptions = JSON.parse(fs.readFileSync(optionsPath, 'utf8'));
    const allOptions = dropdownOptions.options;

    if (!booked_model) {
        return res.status(404).send('Car not found');
    }

    res.render("booking.hbs", { model: booked_model, allOptions });
});
router.get('/api/cars', (req, res) => {
    const dataPath = path.join(__dirname, '../felixCars_en.json'); // <-- use the EN file
    fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Cannot read car data' });
        res.type('json').send(data);
    });
});
router.use(express.static("public"));

// GET Electric Cars (all)
router.get('/', async function (req, res) {
    const electric_models = await ElectricModel.find();
    res.render("electric_index.hbs", { models: electric_models });
});
// ...existing code...
router.get('/', async function (req, res) {
    const electric_models = await ElectricModel.find();
    const currentYear = new Date().getFullYear();
    res.render("electric_index.hbs", { models: electric_models, currentYear });
});
// ...existing code...

// GET Filtering Electric Cars
router.get('/filter', async function (req, res) {
    // Build query object
    const query = {};

    // Price filtering (handle string values like "under50")
    if (req.query.priceBy) {
        if (req.query.priceBy === 'under50') {
            query.price = { $lt: 50000 };
        } else if (req.query.priceBy === 'under100') {
            query.price = { $lt: 100000 };
        } else if (!isNaN(Number(req.query.priceBy))) {
            query.price = { $lte: Number(req.query.priceBy) };
        }
        // else: ignore invalid priceBy
    }

    // Year filtering (exact)
    if (req.query.year && !isNaN(Number(req.query.year))) {
        query.year = Number(req.query.year);
    }

    // Year filtering (less than or equal)
    if (req.query.yearLt && !isNaN(Number(req.query.yearLt))) {
        query.year = { $lte: Number(req.query.yearLt) };
    }

    // Range filtering
    if (req.query.rangeLt && !isNaN(Number(req.query.rangeLt))) {
        query.range = { $lte: Number(req.query.rangeLt) };
    }

    // Mileage filtering
    if (req.query.mileageLt && !isNaN(Number(req.query.mileageLt))) {
        query.mileage = { $lte: Number(req.query.mileageLt) };
    }

    // Sorting
    let sort = {};
    switch (req.query.sortBy) {
        case 'latest':
            sort = { year: -1 };
            break;
        case 'highprice':
            sort = { price: -1 };
            break;
        case 'lowprice':
            sort = { price: 1 };
            break;
        case 'highrange':
            sort = { range: -1 };
            break;
        case 'lowrange':
            sort = { range: 1 };
            break;
        case 'highperf':
            sort = { time60: 1 }; // Assuming lower time60 is better performance
            break;
        case 'lowperf':
            sort = { time60: -1 };
            break;
        default:
            sort = {};
    }

    // Fetch filtered and sorted models
    const filtered_models = await ElectricModel.find(query).sort(sort);

    res.render("electric_index.hbs", { models: filtered_models });
});

// Redirect for filtered booking
router.get('/filter/booknow/:id', async (req, res) => {
    const modelid = req.params.id;
    res.redirect('/electric/booknow/' + modelid);
});

module.exports = router;