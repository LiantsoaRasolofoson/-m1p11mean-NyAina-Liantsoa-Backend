const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OpeningHour = mongoose.model(
    "OpeningHour",

    new Schema({
        day: Number,
        nameDay: String,
        hourOpen: Number,
        hourClose: Number,
        isClosed: Boolean
    })
)

module.exports = OpeningHour;