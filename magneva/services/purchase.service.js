const HttpError = require("../httperror");
const db = require("../models");
const Purchase = db.purchase;

const createPurchase = async(req, res) => {
    let data = req.body;
    try {
        if( data.details.length === 0){
            throw new HttpError("Le(s) détail(s) est(sont) requis", 400);
        }
        const purchase = new Purchase({
            date: data.date,
            details: data.details
        });
        return await purchase.save();
    }
    catch (error) {
        throw error;
    }
}

const getAllPurchases = async(req, res) => {
    try {
        let filter = {};
        const { startDate, endDate } = req.body;
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        const purchases = await Purchase.find(filter)
        .populate({
            path: 'details.piece',
            model: 'Piece'
        })
        .exec();
        // const filteredPurchases = purchases.filter(purchase => {
        //     return purchase.details.some(detail => {
        //         return detail.piece && detail.piece.name.toLowerCase().includes(pieceName);
        //     });
        // });
        return purchases;
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    createPurchase,
    getAllPurchases
}