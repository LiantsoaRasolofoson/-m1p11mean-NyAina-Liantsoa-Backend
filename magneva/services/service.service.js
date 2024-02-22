const db = require("../models");
const Service = db.service;
const moment = require('moment');

const isDureeValid = (duree) => {
    if (duree.length === 0) {
        return false;
    }
    return true;
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
            return res.status(400).send({ error: "Le service "+data.name+" existe déjà sous le nom "+service1.name });
        }
        if(!isDureeValid(data.duree)){
            return res.status(400).send({ error: "La durée est invalide" });
        }
        const service = new Service({
            name: data.name,
            price: data.price,
            duration: moment(data.duree, "HH:mm").format("HHmm"),
            commission: data.commission,
            picture: data.picture
        });
        await service.save();
        res.status(201).send(service);
    } 
    catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getService = async (req, res) => {
    const serviceID = req.params.serviceID;
    try {
        const service = await Service.findOne({ _id: serviceID}).exec();
        if(!service) {
            return res.status(404).send({ error: "Ce service n'existe pas" });
        }
        res.status(200).send(service);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const updateService = async (req, res) => {
    const serviceID = req.params.serviceID;
    let data = req.body;
    try {
        let service = await Service.findOne({ _id: serviceID}).exec();
        if( service == null ){
            return res.status(400).send({ error: "Le service avec l'ID "+serviceID+" n'existe pas"});
        }
        let service1 =  await isServiceExist(data.name);
        if( service1 !== null && !service1._id.equals(service._id)){
            return res.status(400).send({ error: "Le service "+data.name+" existe déjà sous le nom "+service1.name });
        }
        if(!isDureeValid(data.duree)){
            return res.status(400).send({ error: "La durée est invalide" });
        }
        service.name = data.name;
        service.price = data.price;
        service.duration = moment(data.duree, "HH:mm").format("HHmm");
        service.commission = data.commission;
        service.picture = data.picture;
        await service.save();
        res.status(201).send(service);
    } 
    catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().exec();
        res.status(200).send(services);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports = {
    createService,
    getAllServices,
    updateService,
    getService
}
