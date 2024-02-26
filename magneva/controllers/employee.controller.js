const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { employeeService } = require('../services');
const { body } = require('express-validator');

function updatePasswordMiddlewares(){
    return [
        body('lastPassword').notEmpty().withMessage('Ancien mot de passe requis'),
        body('password').notEmpty().withMessage('Nouveau mot de passe requis'),
        requestValidation.check
    ]
}

function updateProfilMiddlewares(){
    return [
        body('name').notEmpty().withMessage('Nom requis.'),
        body('firstName').notEmpty().withMessage('Prénom requis'),
        body('sex').notEmpty().withMessage('Genre requis'),
        body('email').isEmail().withMessage('Email requis'),
        body('startDate').notEmpty().withMessage('Date requise'),
        body('picture').notEmpty().withMessage('Image requise'),
        requestValidation.check
    ]
}

function employeeMiddlewares(){
    return [
        requestValidation.check
    ]
}

router.get("/detail/:employeeID", employeeMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await employeeService.getEmployee(req, res));
    }catch(error){
        next(error);
    }
})

router.put("/updatePassword/:employeeID", updatePasswordMiddlewares(), async(req, res, next) => {
    try{
        res.status(201).send(await employeeService.updatePassword(req, res));
    }catch(error){
        next(error);
    }
})

router.put("/updateProfil/:employeeID", updateProfilMiddlewares(), async(req, res, next) => {
    try{
        res.status(201).send(await employeeService.updateProfil(req, res));
    }catch(error){
        next(error);
    }
})

module.exports = router;