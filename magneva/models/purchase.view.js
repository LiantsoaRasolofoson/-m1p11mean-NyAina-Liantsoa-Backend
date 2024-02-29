const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseViewSchema =  new Schema(
    {
        amount: Number,
        month: Number,
        year: Number
    },
    { autoCreate: false, autoIndex: false }
)

const PurchaseView = mongoose.model('PurchaseView', purchaseViewSchema);

PurchaseView.createCollection(
    {
        viewOn: 'purchases',
        pipeline: [
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                    },
                    amount: { $sum: "$totalAmount" }
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

module.exports = PurchaseView;


            




