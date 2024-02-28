const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { employeeService, hourlyEmployeeService } = require('../services');
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

router.get("/finishTask/:appointmentDetailID", employeeMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await employeeService.finishTask(req, res));
    }catch(error){
        next(error);
    }
})

router.get("/tasksOfDay/:employeeID", employeeMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await employeeService.getTasksOfDay(req, res));
    }catch(error){
        next(error);
    }
})

router.get("/listAppointment/:employeeID", employeeMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await employeeService.allAppointment(req, res));
    }catch(error){
        next(error);
    }
})

// Horaire de Travail
function createHourlyMiddlewares(){
    return [
        body('employee').notEmpty().withMessage('Employé requis.'),
        body('day').notEmpty().withMessage('Jour de la semaine requis'),
        body('nameDay').notEmpty().withMessage('Jour de la semaine requis'),
        body('hourStart').notEmpty().withMessage('Heure début requise'),
        body('hourEnd').notEmpty().withMessage('Heure fin requise'),
        requestValidation.check
    ]
}

router.post("/hourly/create", createHourlyMiddlewares(), async(req, res, next) => {
    try{
        res.status(201).send(await hourlyEmployeeService.createHourlyEmployee(req, res));
    }catch(error){
        next(error);
    }
})

router.get("/hourly/list/:employeeID", async(req, res, next) => {
    try{
        res.status(201).send(await hourlyEmployeeService.allHourly(req, res));
    }catch(error){
        next(error);
    }
})

router.delete("/hourly/delete/:hourlyID", async(req, res, next) => {
    try{
        res.status(201).send(await hourlyEmployeeService.deleteHourly(req, res));
    }catch(error){
        next(error);
    }
})

module.exports = router;