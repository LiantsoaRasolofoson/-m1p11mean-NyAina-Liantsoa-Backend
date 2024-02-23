const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { employeeService } = require('../services');
const { body } = require('express-validator');

// Employe
function employeeMiddlewares(){
    return [
        requestValidation.check
    ]
}

router.post("/employee/create", employeeMiddlewares(), async(req, res, next) => {
    try{
        res.status(201).send(await employeeService.createEmployee(req, res));
    }catch(error){
        next(error);
    }
})

router.get("/employee/list", employeeMiddlewares(),  async(req, res, next) => {
    try{
        res.status(200).send(await employeeService.getAllEmployees(req, res));
    }catch(error){
        next(error);
    }
    
})

router.get("/employee/detail/:employeeID", employeeMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await employeeService.getEmployee(req, res));
    }catch(error){
        next(error);
    }
  
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

router.post("/service/create", createServiceMiddlewares(), async(req, res, next) => {
    try{
        res.status(201).send(await serviceService.createService(req, res));
    }catch(error){
        next(error);
    }
   
})

module.exports = router;