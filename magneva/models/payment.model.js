const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Payment = mongoose.model(
    "Payment",
    new Schema(
        {
            date: Date,
            appointment:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Appointment"
            },
            amount: Number
        },
        { timestamps: true }
    )
) 

module.exports = Payment;