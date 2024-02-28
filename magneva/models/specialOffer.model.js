const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecialOffer = mongoose.model(
    "SpecialOffer",
    new Schema(
        {
            service: {
                type: Schema.Types.ObjectId,
                ref: "Service"
            },
            percentage: Number,
            description: String,
            startDate: Date,
            endDate: Date,
            hourBegin: Number,
            hourEnd: Number
        },
        { timestamps: true }
    )
) 

module.exports = SpecialOffer;