const db = require('../models');
const Service = db.service;
const ServiceReview = db.serviceReview;

const getServicesWithReviews = async () => {
    //get all services
    let services = await Service.find().exec();
    //create json response var
    let response = [];
    //for each get the mean review and add it to the response
    for(let i=0; i < services.length; i++){
        let serviceReview = {};
        serviceReview.service = services[i];
        serviceReview.note = await getServiceMeanReview(services[i]._id);
        response.push(serviceReview);
    }
    // return the services
    return response;
}

const getServiceMeanReview = async (serviceId) => {
    //get all service reviews
    let serviceReviews = await ServiceReview.find({ service : serviceId }).exec();
    // if empty return 0
    if(serviceReviews.length === 0){
        return 0;
    }
    //sum all the reviews divide by number of reviews
    let mean = 0;
    for(const review in serviceReviews){
        mean += review.note;
    }
    //return it 
    // en entier ou float ??
    return mean/serviceReviews.length;
}


module.exports = {
    getServicesWithReviews
}