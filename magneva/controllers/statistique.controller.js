const router = require("express").Router();
const { body } = require('express-validator');
const { requestValidation } = require('../middlewares');
const { statistiqueService } = require('../services');

function statistiqueMiddlewares(){
    return [
        requestValidation.check
    ]   
}

router.post("/statAppointmentInOneDay", statistiqueMiddlewares(), async (req, res, next) => {
    try{
        res.status(200).send(await statistiqueService.statAppointmentInOneDay(req, res));
    }catch(err){
        next(err);
    }
})

router.post("/statAppointment", statistiqueMiddlewares(), async (req, res, next) => {
    try{
        res.status(200).send(await statistiqueService.statAppointment(req, res));
    }catch(err){
        next(err);
    }
})

router.post("/chiffreAffaireDay", statistiqueMiddlewares(), async (req, res, next) => {
    try{
        res.status(200).send(await statistiqueService.chiffreAffaireDay(req, res));
    }catch(err){
        next(err);
    }
})

router.post("/chiffreAffaire", statistiqueMiddlewares(), async (req, res, next) => {
    try{
        res.status(200).send(await statistiqueService.chiffreAffaire(req.body.year));
    }catch(err){
        next(err);
    }
})

router.post("/allDepenses", statistiqueMiddlewares(), async (req, res, next) => {
    try{
        res.status(200).send(await statistiqueService.allDepenses(req.body.year));
    }catch(err){
        next(err);
    }
})

router.post("/profit", statistiqueMiddlewares(), async (req, res, next) => {
    try{
        res.status(200).send(await statistiqueService.profit(req, res));
    }catch(err){
        next(err);
    }
})

router.post("/statsInit", statistiqueMiddlewares(), async (req, res, next) => {
    try{
        res.status(200).send(await statistiqueService.statsInit(req, res));
    }catch(err){
        next(err);
    }
})

router.post("/statEmp", statistiqueMiddlewares(), async (req, res, next) => {
    try{
        res.status(200).send(await statistiqueService.statEmp(req, res));
    }catch(err){
        next(err);
    }
})


module.exports = router;