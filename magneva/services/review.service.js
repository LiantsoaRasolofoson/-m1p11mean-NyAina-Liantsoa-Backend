const HttpError = require('../httperror');
const db = require('../models');
const Service = db.service;
const ServiceReview = db.serviceReview;
const momentTimezone = require('moment-timezone');


const createReview = async(data) => {
    try{
        data.date = momentTimezone.tz('Indian/Antananarivo').format("YYYY-MM-DD");
        let review = new ServiceReview(data);
        await review.save()
        return review;
    }catch(err){
        throw err;
    }
}

const getDataFor = async(serviceId, userId) => {
    try{
        //  get the appropriate service
        let service = await Service.findOne({ _id : serviceId }).exec();
        //  get all the reviews related to it
        let serviceReviews = await ServiceReview.find({ service :  serviceId }).exec();
        //  create a json response
        let jsonResponse = {};
        // add in the service + all the reviews + the userReview
        jsonResponse.service = service;
        jsonResponse.reviews = serviceReviews; 
        jsonResponse.userReview = (userId) ? await ServiceReview.find({ user : userId }) : null;
        // add the mean note
        jsonResponse.note = getServiceMeanReview(serviceReviews);
        return jsonResponse;
    }catch(err){
        throw err;
    }
}


const getServicesWithReviews = async () => {
    //get all services
    let services = await Service.find().exec();
    //create json response var
    let response = [];
    //for each get the mean review and add it to the response
    for(let i=0; i < services.length; i++){
        let serviceReview = {};
        serviceReview.service = services[i];
        serviceReview.note = getServiceMeanReview(await ServiceReview.find({ service : services[i]._id }).exec());
        response.push(serviceReview);
    }
    // return the services
    return response;
}

const getServiceMeanReview = (reviews) => {
    // if empty return 0
    if(reviews.length === 0){
        return 0;
    }
    //sum all the reviews divide by number of reviews
    let mean = 0;
    for(let i=0 ; i<reviews.length; i++){
        console.log(reviews[i].note);
        mean += reviews[i].note;
    }
    //return it 
    // en entier ou float ??
    return mean/reviews.length;
}


module.exports = {
    getServicesWithReviews,
    createReview,
    getDataFor
}