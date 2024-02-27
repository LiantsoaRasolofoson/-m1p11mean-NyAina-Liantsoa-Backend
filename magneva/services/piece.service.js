const HttpError = require("../httperror");
const db = require("../models");
const Piece = db.piece;

const isPieceExist = async (name) => {
    const regex = new RegExp('^' + name + '$', 'i');
    let piece = await Piece.findOne({ name: { $regex: regex } }).exec();
    return piece;
}

const createPiece = async (req, res) => {
    let data = req.body;
    try {
        let piece1 =  await isPieceExist(data.name);
        if( piece1 !== null ){
            throw new HttpError("La pièce "+data.name+" existe déjà sous le nom "+piece1.name , 400);
        }
        const piece = new Piece({
            name: data.name
        });
        return await piece.save();
    }
    catch (error) {
        throw error;
    }
};

const getAllPieces = async (req, res) => {
    try {
        const pieces = await Piece.find().exec();
        return pieces;
    }
    catch (error) {
        throw error;
    }
};

module.exports = {
    createPiece,
    getAllPieces
}