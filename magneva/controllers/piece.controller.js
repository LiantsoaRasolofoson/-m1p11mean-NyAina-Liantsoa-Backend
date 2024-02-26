const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { pieceService } = require('../services');
const { body } = require('express-validator');

function createPieceMiddlewares(){
    return [
        body('name').notEmpty().withMessage('Nom requis'),
        requestValidation.check
    ]
}

function pieceMiddlewares(){
    return [
        requestValidation.check
    ]
}

router.post("/create", createPieceMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await pieceService.createPiece(req, res));
    }catch(error){
        next(error);
    }
})

router.get("/list", pieceMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await pieceService.getAllPieces(req, res));
    }catch(error){
        next(error);
    }
})

module.exports = router;