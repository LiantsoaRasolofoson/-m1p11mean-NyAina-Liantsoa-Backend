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
        res.status(201).send(serviceEmployee);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const role = await Role.findOne({ name: "employee" }).exec();
        const employees = await User.find({ roles: role._id }).exec();
        res.status(200).send(employees);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
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
            return res.status(404).send({ error: "Cet(te) employé(e) n'existe pas" });
        }
        res.status(200).send(employee);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployee
}
