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

module.exports = router;