const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentViewSchema =  new Schema(
    {
        date: Date,
        hour: Number,
        user: String,
        sumPrice: Number,
        isPaid: Boolean
    },
    { autoCreate: false, autoIndex: false }
)

const AppointmentView = mongoose.model('AppointmentView', appointmentViewSchema);

AppointmentView.createCollection(
    {
        viewOn: 'appointments',
        pipeline: [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    'user': { $concat: ['$user.name', ' ', '$user.firstName'] },
                    'date': 1,
                    'hour': 1,
                    'sumPrice': 1,
                    'isPaid':1
                }
            }
        ]
    }
).catch(err => {
    console.log("err");
})

module.exports = AppointmentView;



