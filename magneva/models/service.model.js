var mongoose = require("mongoose");

const Service = mongoose.model(
    "Service", 
    mongoose.Schema(
        {
            name: String,
            price: Number,
            duration: Number,
            commission: Number,
            picture:  {
                type: String,
                default: ""
            } ,
            description: {
                type: String,
                default: ""
            }   
        },
        { timestamps: true }
    )
);

module.exports = Service