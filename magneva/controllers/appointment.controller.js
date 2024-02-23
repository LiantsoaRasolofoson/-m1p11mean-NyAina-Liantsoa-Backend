const router = require("express").Router();
const { body } = require('express-validator');
const { requestValidation } = require('../middlewares');
const { appointmentService } = require('../services');

function createAppointmentMiddlewares(){
    return [
        body('date').notEmpty().withMessage('La date est requise'),
        body('hour').notEmpty().withMessage('L\'heure est requise'),
        requestValidation.check
    ]   
}

router.post("/create", createAppointmentMiddlewares(), async (req, res, next) => {
    try{
        res.status(201).send(await appointmentService.createAppointment(req, res));   
    }catch(err){
        next(err);
    }
    
})

router.get("/list", (req, res) => {
    console.log("Get appointments");
    appointmentService.getAppointments(req, res);
})

router.get("/list", (req, res) => {
    appointmentService.getAppointments(req, res);
})

module.exports = router;