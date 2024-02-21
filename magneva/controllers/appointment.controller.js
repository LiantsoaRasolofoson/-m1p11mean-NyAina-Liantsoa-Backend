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

router.post("/create", createAppointmentMiddlewares(), (req, res, next) => {
    appointmentService.createAppointment(req, res, next);
})

router.get("/list", (req, res) => {
    console.log("Get appointments");
    appointmentService.getAppointments(req, res);
})

module.exports = router;