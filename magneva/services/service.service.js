const db = require("../models");
const Service = db.service;

const createService = async (req, res) => {
    try {
        let data = req.body;
        const service = new Service({
            name: data.name,
            price: data.price,
            duration: data.duration,
            commission: data.commission
        });
        await service.save();
        return service; 
    } 
    catch (error) {
        throw error;
    }
};

module.exports = {
    createService
}
