const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chiffreAffaireViewSchema =  new Schema(
    {
        ca: Number,
        month: Number,
        year: Number
    },
    { autoCreate: false, autoIndex: false }
)

const ChiffreAffaire = mongoose.model('ChiffreAffaire', chiffreAffaireViewSchema);

ChiffreAffaire.createCollection(
    {
        viewOn: 'payments',
        pipeline: [
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                    },
                    ca: { $sum: "$amount" },
                }
            },
            {
                $project: {
                    _id: 0,
                    ca: 1,
                    month: "$_id.month",
                    year: "$_id.year"
                }
            }
        ]
    }
).catch(err => {
    console.log("err");
})

module.exports = ChiffreAffaire;
