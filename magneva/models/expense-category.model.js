const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseCategory = mongoose.model(
    "ExpenseCategory",
    new Schema(
        {
            name: String,
            type: Number
        },
        { timestamps: true }
    )
) 

module.exports = ExpenseCategory;