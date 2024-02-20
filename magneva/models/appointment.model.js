const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Appointment = new Schema(
    "Appointment",
    {
    date: Date,
    hour: Number
    }
)