const mongoose = require("mongoose");

const electricModelSchema = new mongoose.Schema({
    imagePaths: [String],
    title: { type: String, required: false  },
    manufacturer: { type: String,required: false  },
    model: { type: String, required: false },
    type: { type: String, required: false },
    year: { type: Number, required: false  },
    price: { type: Number, required: false  },
    mileage: { type: Number, required: false },
    fuelType: { type: String, required: false },
    transmission: { type: String, required: false },
    color: { type: String, required: false },
    carStatus: { type: String, required: false },
    range: { type: Number, required: false },
    category: { type: String, required: false },
    options: [{ type: String }],
   
   
    
});

module.exports = mongoose.model("ElectricModel", electricModelSchema);