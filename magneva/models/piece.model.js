const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Piece = mongoose.model(
    "Piece",
    new Schema(
        {
            name: String
        },
        { timestamps: true }
    )
) 

module.exports = Piece;