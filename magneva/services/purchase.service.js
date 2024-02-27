const HttpError = require("../httperror");
const db = require("../models");
const Purchase = db.purchase;

const createPurchase = async(req, res) => {
    let data = req.body;
    try {
        if( data.details.length === 0){
            throw new HttpError("Le(s) détail(s) est(sont) requis", 400);
        };
        let total = 0;
        for(var i=0; i<data.details.length; i++){
            total += data.details[i].quantity*data.details[i].unitPrice;
        }
        const purchase = new Purchase({
            date: data.date,
            details: data.details,
            totalAmount: total
        });
        return await purchase.save();
    }
    catch (error) {
        throw error;
    }
}

const getPurchase = async(req, res) => {
    const purchaseID = req.params.purchaseID;
    try {
        const purchase = await Purchase.findOne({_id: purchaseID})
        .populate({
            path: 'details.piece',
            model: 'Piece'
        })
        .exec();
        if(!purchase) {
            throw new HttpError("Cet achat n'existe pas", 400);
        }
        return purchase;
    }
    catch (error) {
        throw error;
    }
}

const getAllPurchases = async(req, res) => {
    try {
        let filter = {};
        const { startDate, endDate, minAmount, maxAmount } = req.query;
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            filter.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.date = { $lte: new Date(endDate) };
        }
        if (minAmount && maxAmount) {
            filter.totalAmount = { $gte: parseFloat(minAmount), $lte: parseFloat(maxAmount) };
        } else {
            if (minAmount) {
                filter.totalAmount = { $gte: parseFloat(minAmount) };
            }
            if (maxAmount) {
                filter.totalAmount = { $lte: parseFloat(maxAmount) };
            }
        }
        console.log(filter);
        const purchases = await Purchase.find(filter)
        .populate({
            path: 'details.piece',
            model: 'Piece'
        })
        .sort({ date: -1 })
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

const deletePurchase = async (req, res) => {
    const purchaseID = req.params.purchaseID;
    try {
        const purchase = await Purchase.findByIdAndDelete(purchaseID);
        if (!purchase) {
            throw new HttpError("Cet achat n'existe pas", 400);
        }
        return await getAllPurchases(req, res);
    } 
    catch (error) {
        throw error;
    }
};

module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchase,
    deletePurchase
}