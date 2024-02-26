const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { serviceService } = require('../services');
const { body } = require('express-validator');

function createServiceMiddlewares(){
    return [
        body('name').notEmpty().withMessage('Nom requise'),
        body('price').isNumeric().withMessage('Prix invalide'),
        body('commission').isNumeric().withMessage('Commission invalide'),
        body('picture').notEmpty().withMessage('Image requise'),
        body('description').notEmpty().withMessage('Description requise'),
        requestValidation.check
    ]
}

router.post("/create", createServiceMiddlewares(), async (req, res, next) => {
    console.log('Taille des données reçues:', req.body.length);
    try{
        res.status(201).send(await serviceService.createService(req, res));
    }catch(error){
        next(error);
    }
});

router.get("/list", async (req, res, next) => {
    try{
        res.status(201).send(await serviceService.getAllServices(req, res));
    }catch(error){
        next(error);
    }
});

router.get("/detail/:serviceID", async (req, res, next) => {
    try{
        res.status(201).send(await serviceService.getService(req, res));
    }catch(error){
        next(error);
    }
});

router.put("/update/:serviceID", createServiceMiddlewares(), async (req, res, next) => {
    try{
        res.status(201).send(serviceService.updateService(req, res));
    }catch(error){
        next(error);
    }
});

module.exports = router;