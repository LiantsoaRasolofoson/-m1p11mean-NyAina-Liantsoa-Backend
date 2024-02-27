const HttpError = require('../httperror');
const db = require('../models');
const employeeService = require('./employee.service');
const Service = db.service;
const User = db.user;
const Review = db.review;
const momentTimezone = require('moment-timezone');

const createReview = async(data) => {
    try{
        data.date = momentTimezone.tz('Indian/Antananarivo').format("YYYY-MM-DD");
        let review = new Review(data);
        await review.save()
        return review;
    }catch(err){
        throw err;
    }
}


// {
//     reviewId : xxx,
//     note : 5,
//     description
// }
const updateReview = async (data) => {
    try{
        //find the review and update
        const review = await Review.findOneAndUpdate(
            { _id : data.reviewId }, 
            {
                date : momentTimezone.tz('Indian/Antananarivo').format("YYYY-MM-DD"),
                description : data.description ,
                note : data.note
            }, {
            new: true
        });          
        return review
    }catch(err){
        throw err;
    }

}

const getDataFor = async(entityName, entityId, userId) => {
    try{
        //  get the appropriate entity
        let entity = (entityName == "service" ) ? await Service.findOne({ _id : entityId }).exec() :  
        await User.findOne({ _id : entityId }) ;
        if(!entity){
            throw new HttpError("Not found", 404);
        }
        //  get all the reviews related to it
        let query = {};
        query[entityName] = entityId;
        let reviews = await Review.find(query).populate('user', 'name firstName').exec();
        //  create a json response
        let jsonResponse = {};
        // add in the entity + all the reviews + the userReview
        jsonResponse.entity = entity;
        jsonResponse.reviews = reviews; 
        query["user"] = userId;
        jsonResponse.userReview = (userId) ? await Review.findOne(query).populate('user', 'name firstName').exec() : null;
        // add the mean note
        jsonResponse.note = getServiceMeanReview(reviews);
        return jsonResponse;
    }catch(err){
        throw err;
    }
}


//service or employee
const getEntitiesWithReviews = async (entityName) => {
    //get all entities
    let entities = (entityName == "service") ? await Service.find().exec() : await employeeService.getValidEmployees()  ;
    //create json response var
    let response = [];
    //for each get the mean review and add it to the response
    for(let i=0; i < entities.length; i++){
        let entityReview = {};
        let query = {};
        query[entityName] =  entities[i]._id;
        console.log(query);
        entityReview.note = getServiceMeanReview(await Review.find(query).exec());
        entityReview.entity = entities[i];
        response.push(entityReview);
    }
    // return the services
    response.sort((a, b) => {
        const dateA = new Date(a.entity.createdAt);
        const dateB = new Date(b.entity.createdAt);
      
        return dateB - dateA;
      });
    return response;
}

const getServiceMeanReview = (reviews) => {
    console.log(reviews);
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
    getEntitiesWithReviews,
    createReview,
    getDataFor,
    updateReview
}