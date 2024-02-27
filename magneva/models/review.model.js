const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = mongoose.model(
    "Review",
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
            employee:
                {
                    type: Schema.Types.ObjectId,
                    ref: "User"
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

module.exports = Review;