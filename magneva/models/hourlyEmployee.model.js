const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HourlyEmployee = mongoose.model(
    "HourlyEmployee",
    new Schema(
        {
            employee: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            day: Number,
            nameDay: String,
            hourStart: Number,
            hourEnd: Number
        },
        { timestamp: true }
    )
)




module.exports = HourlyEmployee;