const router = require('express').Router();
const { reviewService } = require('../services');


router.get('/services', async (req, res, next) => {

    try{
        res.status(200).send(await reviewService.getServicesWithReviews());
    }catch(err){
        next(err);
    }
})

module.exports = router;