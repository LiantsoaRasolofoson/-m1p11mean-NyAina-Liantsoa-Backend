const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Purchase = mongoose.model(
    "Purchase",
    new Schema(
        {
            date: Date,
            details: [
                {
                    piece: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Piece"
                    },
                    quantity: Number,
                    unitPrice: Number
                }
            ],
            totalAmount: Number
        },
        { timestamps: true }
    )
) 

module.exports = Purchase;