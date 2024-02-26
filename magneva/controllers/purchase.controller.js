const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { purchaseService } = require('../services');
const { body } = require('express-validator');

function createPurchaseMiddlewares(){
    return [
        body('date').notEmpty().withMessage('Date requis'),
        body('details.*.quantity').isNumeric().withMessage('La quantité doit être un nombre').isFloat({ min: 0 }).withMessage('La quantité doit être positive'),
        body('details.*.unitPrice').isNumeric().withMessage('Le prix unitaire doit être un nombre').isFloat({ min: 0 }).withMessage('Le prix unitaire doit être positif'),
        requestValidation.check
    ]
}

function purchaseMiddlewares(){
    return [
        requestValidation.check
    ]
}

router.post("/create", createPurchaseMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await purchaseService.createPurchase(req, res));
    }catch(error){
        next(error);
    }
})

router.get("/list", purchaseMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await purchaseService.getAllPurchases(req, res));
    }catch(error){
        next(error);
    }
})

module.exports = router;