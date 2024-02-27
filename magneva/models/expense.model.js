const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Expense = mongoose.model(
    "Expense",
    new Schema(
        {
            date: Date,
            amount: Number,
            motif: String,
            expenseCategory:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "ExpenseCategory"
            }
        },
        { timestamps: true }
    )
) 

module.exports = Expense;