var mongoose = require("mongoose");

const Service = mongoose.model(
    "Service", 
    mongoose.Schema(
        {
            name: String,
            price: Number,
            duration: Number,
            commission: Number
        },
        { timestamps: true }
    )
);

module.exports = Service