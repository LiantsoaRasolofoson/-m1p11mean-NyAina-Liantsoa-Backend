const router = require("express").Router();
const { body } = require('express-validator');
const { requestValidation } = require('../middlewares');
const { appointmentService, reviewService } = require('../services');

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
    console.log("Get appointments");
    try{
        res.status(200).send(await  appointmentService.getAppointments(req, res));
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

module.exports = router;