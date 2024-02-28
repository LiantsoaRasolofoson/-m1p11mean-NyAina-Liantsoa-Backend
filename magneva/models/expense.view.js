const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseViewSchema =  new Schema(
    {
        amount: Number,
        month: Number,
        year: Number
    },
    { autoCreate: false, autoIndex: false }
)

const ExpenseView = mongoose.model('ExpenseView', expenseViewSchema);

ExpenseView.createCollection(
    {
        viewOn: 'expenses',
        pipeline: [
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                    },
                    amount: { $sum: "$amount" },
                }
            },
            {
                $project: {
                    _id: 0,
                    amount: 1,
                    month: "$_id.month",
                    year: "$_id.year"
                }
            }
        ]
    }
).catch(err => {
    console.log("err");
})

module.exports = ExpenseView;


            




