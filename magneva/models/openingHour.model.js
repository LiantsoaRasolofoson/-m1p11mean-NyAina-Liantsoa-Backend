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

// OpeningHour.create([
//     {day: 0, nameDay:"Dimanche", hourOpen: "0", hourClose: "0", isClosed: false}, 
//     {day: 1, nameDay:"Lundi", hourOpen: "800", hourClose: "1800", isClosed: false},
//     {day: 2, nameDay:"Mardi", hourOpen: "800", hourClose: "1800", isClosed: false},
//     {day: 3, nameDay:"Mercredi", hourOpen: "800", hourClose: "1800", isClosed: false},
//     {day: 4, nameDay:"Jeudi", hourOpen: "800", hourClose: "1800", isClosed: false},
//     {day: 5, nameDay:"Vendredi", hourOpen: "800", hourClose: "1800", isClosed: false},
//     {day: 6, nameDay:"Samedi", hourOpen: "800", hourClose: "1800", isClosed: false},
// ])

module.exports = OpeningHour;