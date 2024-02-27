const router = require('express').Router();
const { reviewService } = require('../services');
const { body } = require('express-validator');
const { requestValidation } = require('../middlewares');

const checkReviewCreation = () => {
    return [
        body("description").notEmpty().withMessage("Une description est requise."),
        body("note").isFloat({min:0, max:5}).withMessage("La note doit être entre 0 et 5."),
        requestValidation.check
    ]
}


router.get('/services', async (req, res, next) => {
    try{
        res.status(200).send(await reviewService.getServicesWithReviews());
    }catch(err){
        next(err);
    }
})

router.post('/service', checkReviewCreation(), async (req, res, next) => {
    try{
        res.status(201).send(await reviewService.createReview(req.body));
    }catch(err){
        next(err);
    }

})

router.put('/service', checkReviewCreation(), async (req, res, next) => {
    try{
        res.status(201).send(await reviewService.updateReview(req.body));
    }catch(err){
        next(err);
    }
})

//get all the necessary datas for the front page details of a service
router.get('/service/:serviceId', async(req, res, next) => {
    try{
        res.status(201).send(await reviewService.getDataFor(req.params.serviceId, req.query.userId));
    }catch(err){
        next(err);
    }
})

module.exports = router;