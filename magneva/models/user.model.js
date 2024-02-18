var mongoose = require("mongoose");

const User = mongoose.model(
    "User", 
    mongoose.Schema(
        {
            name: String,
            firstName: String,
            sex: Number,
            email: String,
            password: String,
            contact: String,
            roles:[
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Role"
                }
            ],
            startDate: { 
                type: Date, 
                default: null, 
                allowNull: true 
            },
            endDate: { 
                type: Date, 
                default: null, 
                allowNull: true 
            },
            picture: {
                type: String,
                default: null
            }
        },
        { timestamps: true}
    )
);

module.exports = User