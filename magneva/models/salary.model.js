var mongoose = require("mongoose");

const Salary = mongoose.model(
    "Salary", 
    mongoose.Schema(
        {
            employee:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            amount: Number,
            date: Date
        },
        { timestamps: true}
    )
);

module.exports = Salary