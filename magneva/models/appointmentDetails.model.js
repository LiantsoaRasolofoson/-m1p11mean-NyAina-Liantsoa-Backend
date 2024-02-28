const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentDetail = mongoose.model(
    "AppointmentDetail",
    new Schema(
        {
            service: {
                type: Schema.Types.ObjectId,
                ref: "Service"
            },
            employee: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            price : Number,
            reduction : {
                type: Number,
                default: 0
            },
            date: Date,
            hourBegin: Number,
            hourEnd: Number,
            isFinished: {
                type: Number,
                default: 0
            },
            client: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            appointment: {
                type: Schema.Types.ObjectId,
                ref: "Appointment"
            },
        },
        { timestamp: true }
    )
)

module.exports = AppointmentDetail;