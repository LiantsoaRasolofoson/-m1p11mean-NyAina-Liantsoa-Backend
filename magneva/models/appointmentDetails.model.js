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
            hourBegin: Number,
            hourEnd: Number
        },
        { timestamp: true }
    )
)

module.exports = AppointmentDetail;