const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { specialOfferService } = require('../services');
const { body } = require('express-validator');

function createSpecialOfferMiddlewares(){
    return [
        body('service').notEmpty().withMessage('Service requis'),
        body('percentage').isNumeric().withMessage('Pourcentage invalide').custom(value => {
            if (value < 0) {
                throw new Error('Le pourcentage ne peut pas être négatif');
            }
            return true;
        }),
        body('description').notEmpty().withMessage('Description requise'),
        body('startDate').notEmpty().withMessage('Date début requise'),
        body('endDate').notEmpty().withMessage('Date fin requise'),
        requestValidation.check
    ]
}

function specialOfferMiddlewares(){
    return [
        requestValidation.check
    ]
}

router.post("/create", createSpecialOfferMiddlewares(), async (req, res, next) => {
    
    try{
        res.status(201).send(await specialOfferService.createSpecialOffer(req, res));
    }catch(error){
        next(error);
    }
});

router.get("/list", specialOfferMiddlewares(), async (req, res, next) => {
    try{
        res.status(201).send(await specialOfferService.getAllSpecialOffer(req, res));
    }catch(error){
        next(error);
    }
});

router.get("/detail/:specialOfferID", specialOfferMiddlewares(), async (req, res, next) => {
    try{
        res.status(201).send(await specialOfferService.getSpecialOffer(req, res));
    }catch(error){
        next(error);
    }
});

router.get("/sendMailToClients/:specialOfferID", specialOfferMiddlewares(), async (req, res, next) => {
    try{
        res.status(201).send(await specialOfferService.sendMailToClients(req, res));
    }catch(error){
        next(error);
    }
});

router.delete("/delete/:specialOfferID", specialOfferMiddlewares(), async (req, res, next) => {
    try{
        res.status(201).send(await specialOfferService.deleteSpecialOffer(req, res));
    }catch(error){
        next(error);
    }
});

module.exports = router;