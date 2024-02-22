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
        requestValidation.check
    ]
}

router.post("/create", createServiceMiddlewares(), (req, res, next) => {
    serviceService.createService(req, res, next);
});

router.get("/list", (req, res, next) => {
    serviceService.getAllServices(req, res, next);
});

router.get("/detail/:serviceID", (req, res, next) => {
    serviceService.getService(req, res, next);
});

router.put("/update/:serviceID", createServiceMiddlewares(), (req, res, next) => {
    serviceService.updateService(req, res, next);
});

module.exports = router;