const HttpError = require("../httperror");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Service = db.service;
const ServiceEmployee = db.serviceEmployee;
const { signUp } = require("./auth.service");

const createEmployee = async (req, res, next) => {
    try {
        let data = req.body;
        if( data.services.length === 0){
            throw new HttpError("Le(s) service(s) est(sont) requis", 400);
        }
        const user = await signUp(req, res);
        const serviceEmployee = new ServiceEmployee({
            employee: user._id
        });
        console.log("Etttt");
        services = await Service.find({ _id: { $in: data.services } }).exec();
        serviceEmployee.services = services.map(service => service._id);
        await serviceEmployee.save();
        res.status(201).send(serviceEmployee);
    }
    catch (error) {
        next(error);
    }
};

const getAllEmployees = async (req, res, next) => {
    try {
        const role = await Role.findOne({ name: "employee" }).exec();
        const employees = await User.find({ roles: role._id }).exec();
        res.status(200).send(employees);
    }
    catch (error) {
        next(error);
    }
}

const getEmployee = async (req, res, next) => {
    const employeeID = req.params.employeeID;
    try {
        const employee = await ServiceEmployee.findOne({ employee: employeeID })
            .populate('employee')
            .populate('services')
        ;
        if(!employee) {
            throw new HttpError("Cet(te) employé(e) n'existe pas", 404);
        }
        res.status(200).send(employee);
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployee
}
