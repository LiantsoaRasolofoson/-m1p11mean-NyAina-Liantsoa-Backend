const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Appointment = mongoose.model(
    "Appointment",
    new Schema(
        {
            date: Date,
            hour: Number,
            user: 
                {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                }
            ,
            appointmentDetails: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "AppointmentDetail"
                }
            ],
            sumPrice: Number,
            isPaid : {
                type: Boolean,
                default: false
            },
            duration: Number
        },
        { timestamps: true }
    )
) 

module.exports = Appointment;