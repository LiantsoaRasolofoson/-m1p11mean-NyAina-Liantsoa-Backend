const HttpError = require("../httperror");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Service = db.service;
const Salary = db.salary;
const ServiceEmployee = db.serviceEmployee;
const { signUp } = require("./auth.service");

const createEmployee = async (req, res, next) => {
    try {
        let data = req.body;
        if( data.services.length === 0){
            throw new HttpError("Le(s) service(s) est(sont) requis", 400);
        }
        const user = await signUp(req, res, next);
        const serviceEmployee = new ServiceEmployee({
            employee: user._id
        });
        console.log("Etttt");
        services = await Service.find({ _id: { $in: data.services } }).exec();
        serviceEmployee.services = services.map(service => service._id);
        await serviceEmployee.save();
        return serviceEmployee;
    }
    catch (error) {
        throw error;
    }
};

const getAllEmployees = async (req, res, next) => {
    try {
        const role = await Role.findOne({ name: "employee" }).exec();
        const employees = await User.find({ roles: role._id }).exec();
       return employees;
    }
    catch (error) {
        throw error;
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
            throw new HttpError("Cet(te) employé(e) n'existe pas", 400);
        }
        const salary = await getSalary(employee);
        const emp = {
            info: employee,
            salary: salary
        };
        return emp;  
    }
    catch (error) {
       throw error;
    }
}

const getSalary = async (employee) => {
    try{
        const salary = await Salary.findOne({employee: employee.employee._id})
            .sort({ date: -1 })
            .limit(1)
        ;
        return salary;
    }
    catch (error) {
       throw error;
    }
}

const addSalary = async (req, res) => {
    const data = req.body;
    try{
        const salary = new Salary({
            employee: data.employee,
            amount: data.amount,
            date: data.date
        });
        return await salary.save();
    }
    catch (error) {
       throw error;
    }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployee,
    addSalary
}
