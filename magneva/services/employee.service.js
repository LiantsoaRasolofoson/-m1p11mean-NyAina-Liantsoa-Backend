const HttpError = require("../httperror");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Service = db.service;
const Salary = db.salary;
const ServiceEmployee = db.serviceEmployee;
const { signUp } = require("./auth.service");
const { getAppointmentDetailByEmployee } = require("./appointment.service");
var bcrypt = require("bcryptjs");

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

const isPasswordValid = (lastPassword, userPassword) => {
    return bcrypt.compareSync(
        lastPassword,
        userPassword
    );
}

const updatePassword = async (req, res) => {
    const employeeID = req.params.employeeID;
    try{
        let data = req.body;
        const employee = await User.findOne({_id: employeeID});
        if(!employee) {
            throw new HttpError("Cet(te) employé(e) n'existe pas", 400);
        }
        if(!isPasswordValid(data.lastPassword, employee.password)){
            throw new HttpError("L'ancien mot de passe est incorrect", 400);
        }
        employee.password = bcrypt.hashSync(data.password, 8);
        return await employee.save();
    }
    catch (error) {
       throw error;
    }
}

const getEmployeeByMail = async (email) => {
    let user = await User.findOne({ email: email }).exec();
    return user;
}

const updateProfil = async (req, res) => {
    const employeeID = req.params.employeeID;
    try{
        let data = req.body;
        const employee = await User.findOne({_id: employeeID});
        if(!employee) {
            throw new HttpError("Cet(te) employé(e) n'existe pas", 400);
        }
        const emp = await getEmployeeByMail(data.email);
        if(emp && !emp._id.equals(employee._id) ){
            throw new HttpError("Ce mail est déjà utilisé", 400);
        }
        employee.name = data.name;
        employee.firstName = data.firstName;
        employee.sex = data.sex;
        employee.email = data.email;
        employee.startDate = data.startDate;
        employee.picture = data.picture;
        employee.contact = data.contact;
        return await employee.save();
    }
    catch (error) {
       throw error;
    }
}

const removeService = async (req, res) => {
    let data = req.body;
    try{
        await ServiceEmployee.findOneAndUpdate(
            { _id: data.serviceEmployeeID },
            { $pull: { services: data.serviceID } },
            { new: true }
        );
        return await getEmployee(req, res);
    }
    catch (error) {
       throw error;
    }
}

const addService = async (req, res) => {
    try{
        let data = req.body;
        const serviceEmployee = await ServiceEmployee.findOneAndUpdate(
            { _id: data.serviceEmployeeID , services: { $ne: data.serviceID  } },
            { $addToSet: { services: data.serviceID  } },
            { new: true }
        );
        if (!serviceEmployee) {
            throw new HttpError("Ce service est déjà affecté à l'employé(e)", 400);
        }
        return await getEmployee(req, res);
    }
    catch (error) {
       throw error;
    }
}

const taskAndCommission = async(req, res) => {
    const employeeID = req.params.employeeID;
    let commission = 0;
    try{
        const employee = await User.findOne({_id: employeeID});
        if(!employee) {
            throw new HttpError("Cet(te) employé(e) n'existe pas", 400);
        }
        date = new Date();
        const appointmentDetails = await getAppointmentDetailByEmployee(date, employeeID, true);
        appointmentDetails.forEach(appointmentDetail => {
            commission += (appointmentDetail.service.price * appointmentDetail.service.commission)/100;
        });
        const data = {
            appointmentDetails: appointmentDetails,
            commission: commission
        };
        return data;
    }
    catch (error) {
       throw error;
    }
}


module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployee,
    addSalary,
    updatePassword,
    updateProfil,
    removeService,
    addService,
    taskAndCommission
}
