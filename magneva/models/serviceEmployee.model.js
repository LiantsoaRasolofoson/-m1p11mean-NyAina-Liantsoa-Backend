var mongoose = require("mongoose");

const ServiceEmployee = mongoose.model(
    "ServiceEmployee", 
    mongoose.Schema(
        {
            employee:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            services:[
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Service"
                }
            ]
        },
        { timestamps: true}
    )
);

module.exports = ServiceEmployee