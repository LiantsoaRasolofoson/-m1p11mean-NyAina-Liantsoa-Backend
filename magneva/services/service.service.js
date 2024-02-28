const HttpError = require("../httperror");
const db = require("../models");
const Service = db.service;
const moment = require('moment');

const isDureeValid = (duree) => {
    if (duree.length === 0) {
        throw new HttpError("La durée est invalide", 400);
    }
}

const isServiceExist = async (name) => {
    const regex = new RegExp('^' + name + '$', 'i');
    let service = await Service.findOne({ name: { $regex: regex } }).exec();
    return service;
}

const createService = async (req, res) => {
    let data = req.body;
    try {
        let service1 =  await isServiceExist(data.name);
        if( service1 !== null ){
            throw new HttpError("Le service "+data.name+" existe déjà sous le nom "+service1.name , 400);
        }
        isDureeValid(data.duree);
        const service = new Service({
            name: data.name,
            price: data.price,
            duration: moment(data.duree, "HH:mm").format("HHmm"),
            commission: data.commission,
            picture: data.picture,
            description: data.description
        });
        await service.save();
        return service; 
    } 
    catch (error) {
        throw error;
    }
};

const getService = async (req, res) => {
    const serviceID = req.params.serviceID;
    try {
        const service = await Service.findOne({ _id: serviceID}).exec();
        if(!service) {
            throw new HttpError("Ce service n'existe pas" , 404);
        }
        return service;
    }
    catch (error) {
        throw error;
    }
}

const updateService = async (req, res) => {
    const serviceID = req.params.serviceID;
    let data = req.body;
    try {
        let service = await Service.findOne({ _id: serviceID}).exec();
        if( service == null ){
            throw new HttpError("Le service avec l'ID "+serviceID+" n'existe pas" , 400);
        }
        let service1 =  await isServiceExist(data.name);
        if( service1 !== null && !service1._id.equals(service._id)){
            throw new HttpError("Le service "+data.name+" existe déjà sous le nom "+service1.name , 400);
        }
        isDureeValid(data.duree);
        service.name = data.name;
        service.price = data.price;
        service.duration = moment(data.duree, "HH:mm").format("HHmm");
        service.commission = data.commission;
        service.picture = data.picture;
        service.description = data.description;
        await service.save();
        return service;
    } 
    catch (error) {
        throw error;
    }
};

const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().exec();
        return services;
    }
    catch (error) {
        throw error;
    }
}

const getReduction = (req, res) => {
    return 0;
}

module.exports = {
    createService,
    getAllServices,
    updateService,
    getService,
    getReduction
}
