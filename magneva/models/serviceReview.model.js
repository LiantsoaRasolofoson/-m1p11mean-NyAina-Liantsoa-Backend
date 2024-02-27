const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceReview = mongoose.model(
    "ServiceReview",
    new Schema(
        {
            date: Date,
            user: 
                {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                }
            ,
            service: 
                {
                    type: Schema.Types.ObjectId,
                    ref: "Service"
                }
            ,
            description: {
                type: String,
                default: ""
            },
            note: Number
        },
        { timestamps: true }
    )
) 

module.exports = ServiceReview;