var mongoose = require("mongoose");

const Service = mongoose.model(
    "Service", 
    mongoose.Schema(
        {
            name: String,
            price: Number,
            duration: Number,
            commission: Number,
            picture: String
        },
        { timestamps: true }
    )
);

module.exports = Service