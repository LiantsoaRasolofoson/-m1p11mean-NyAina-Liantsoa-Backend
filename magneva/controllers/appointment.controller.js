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

router.post("/create", createAppointmentMiddlewares(), (req, res) => {
    appointmentService.createAppointment(req, res);
})

module.exports = router;