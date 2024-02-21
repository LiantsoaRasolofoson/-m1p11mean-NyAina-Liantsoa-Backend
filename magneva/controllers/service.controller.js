const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { serviceService } = require('../services');
const { body } = require('express-validator');

function createServiceMiddlewares(){
    return [
        body('name').notEmpty().withMessage('Nom requise'),
        body('price').isNumeric().withMessage('Prix invalide'),
        body('duration').notEmpty().withMessage('Durée requise'),
        body('commission').isNumeric().withMessage('Commission invalide'),
        body('picture').notEmpty().withMessage('Image requise'),
        requestValidation.check
    ]
}

router.post("/create", createServiceMiddlewares(), (req, res) => {
    serviceService.createService(req, res);
});

router.get("/list", (req, res) => {
    serviceService.getAllServices(req, res);
})

module.exports = router;