const router = require("express").Router();
const { body } = require('express-validator');
const { requestValidation } = require('../middlewares');
const { appointmentService, reviewService, paymentService } = require('../services');

function createAppointmentMiddlewares(){
    return [
        body('date').notEmpty().withMessage('La date est requise'),
        body('hour').notEmpty().withMessage('L\'heure est requise'),
        requestValidation.check
    ]   
}

router.post("/create", createAppointmentMiddlewares(), async (req, res, next) => {
    try{
        res.status(201).send(await appointmentService.createAppointment(req.body));   
    }catch(err){
        next(err);
    }
})

router.get("/list", async (req, res, next) => {
    try{
        res.status(200).send(await appointmentService.getAppointments(req.query));
    }catch(err){
        next(err);
    }
})

router.get("/create/datas", async (req, res, next) => {
    try{
        res.status(200).send(await appointmentService.getCreateDatas(await reviewService.getEntitiesWithReviews("service"), 
        await reviewService.getEntitiesWithReviews("employee")));
    }catch(err){
        next (err);
    }
})

function createPaymentMiddlewares(){
    return [
        body('date').notEmpty().withMessage('La date est requise'),
        body('appointment').notEmpty().withMessage('Rendez-vous requis'),
        body('amount').isNumeric().withMessage('Montant invalide').custom(value => {
            if (value < 0) {
                throw new Error('Le montant ne peut pas être négatif');
            }
            return true;
        }),
        requestValidation.check
    ]   
}

router.post("/payment/create", createPaymentMiddlewares(), async (req, res, next) => {
    try{
        res.status(201).send(await paymentService.createPayment(req, res));   
    }catch(err){
        next(err);
    }
})

router.get("/:id", async (req, res, next) => {
    try{
        let jsonResponse = {};
        jsonResponse.appointment = await appointmentService.getAppointment(req.params.id);
        jsonResponse.isAlreadyPassed = appointmentService.isAlreadyPassed(jsonResponse.appointment);
        res.status(200).send(jsonResponse);
    }catch(err){
        next (err);
    }
})

module.exports = router;