const HttpError = require("../httperror");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Service = db.service;
const ServiceEmployee = db.serviceEmployee;
const { signUp } = require("./auth.service");

const createEmployee = async (req, res) => {
    try {
        let data = req.body;
        const user = await signUp(req, res);
        const serviceEmployee = new ServiceEmployee({
            employee: user._id
        });
        services = await Service.find({ _id: { $in: data.services } }).exec();
        serviceEmployee.services = services.map(service => service._id);
        await serviceEmployee.save();
        return serviceEmployee;
    }
    catch (error) {
        throw error;
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const role = await Role.findOne({ name: "employee" }).exec();
        const employees = await User.find({ roles: role._id }).exec();
       return employees;
    }
    catch (error) {
        throw error;
    }
}

const getEmployee = async (req, res) => {
    const employeeID = req.params.employeeID;
    try {
        const employee = await ServiceEmployee.findOne({ employee: employeeID })
            .populate('employee')
            .populate('services')
        ;
        if(!employee) {
            throw new HttpError("Cet(te) employé(e) n'existe pas", 400);
        }
        return employee;  
    }
    catch (error) {
       throw error;
    }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployee
}
