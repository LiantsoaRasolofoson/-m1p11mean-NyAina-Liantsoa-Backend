const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { employeeService, serviceService } = require('../services');
const { body } = require('express-validator');

// Employe
function employeeMiddlewares(){
    return [
        requestValidation.check
    ]
}

router.post("/employee/create", employeeMiddlewares(), (req, res) => {
    employeeService.createEmployee(req, res);
})

router.get("/employee/list", employeeMiddlewares(),  (req, res) => {
    employeeService.getAllEmployees(req, res);
})

router.get("/employee/detail/:employeeID", employeeMiddlewares(), (req, res) => {
    employeeService.getEmployee(req, res);
})

// Service
function createServiceMiddlewares(){
    return [
        body('name').notEmpty().withMessage('Nom requise'),
        body('price').isNumeric().withMessage('Prix invalide'),
        body('duration').notEmpty().withMessage('Durée requise'),
        body('commission').isNumeric().withMessage('Commission invalide'),
        requestValidation.check
    ]
}

router.post("/service/create", createServiceMiddlewares(), (req, res) => {
    serviceService.createService(req, res);
})

module.exports = router;