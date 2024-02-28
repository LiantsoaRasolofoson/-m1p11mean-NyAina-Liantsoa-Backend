const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statAppointmentViewSchema =  new Schema(
    {
        nb: Number,
        month: Number,
        year: Number
    },
    { autoCreate: false, autoIndex: false }
)

const StatAppointment = mongoose.model('StatAppointment', statAppointmentViewSchema);

StatAppointment.createCollection(
    {
        viewOn: 'appointments',
        pipeline: [
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                    },
                    nb: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    nb: 1,
                    month: "$_id.month",
                    year: "$_id.year"
                }
            }
        ]
    }
).catch(err => {
    console.log("err");
})

module.exports = StatAppointment;
