const HttpError = require("../httperror");
const db = require("../models");
const HourlyEmployee = db.hourlyEmployee;
const moment = require('moment');

const getHourlyEmployee = async (employeeID, day) => {
    try{
        const hourlyEmp = await HourlyEmployee.find({
            employee: employeeID,
            day: day
        }).exec();
        return hourlyEmp;
    }
    catch (error) {
        throw error;
    }
}

const isDetailValid = async (hourlyEmployee) => {
    try{
        const hourlyEmps = await getHourlyEmployee(hourlyEmployee.employee, hourlyEmployee.day);
        hourlyEmps.forEach((hourly) => {
            if( hourlyEmployee.hourStart <= hourly.hourStart && hourly.hourEnd <= hourlyEmployee.hourEnd ){
                throw new HttpError("Cet intervalle de temps est en conflit avec d'autres", 400);
            }
            if( (hourly.hourStart <= hourlyEmployee.hourStart && hourlyEmployee.hourStart <= hourly.hourEnd ) || (hourly.hourStart <= hourlyEmployee.hourEnd && hourlyEmployee.hourEnd <= hourly.hourEnd )){
                throw new HttpError("Cet intervalle de temps est en conflit avec d'autres", 400);
            }
        });
    }
    catch (error) {
        throw error;
    }

}

const createHourlyEmployee = async (req, res) => {
    let data = req.body;
    try {
        const hourlyEmployee = new HourlyEmployee({
            employee : data.employee,
            day: data.day,
            nameDay: data.nameDay,
            hourStart: moment(data.hourStart, "HH:mm").format("HHmm"),
            hourEnd: moment(data.hourEnd, "HH:mm").format("HHmm")
        });
        await isDetailValid(hourlyEmployee);
        await hourlyEmployee.save();
        return hourlyEmployee; 
    } 
    catch (error) {
        throw error;
    }
};

const allHourly = async (req, res) => {
    const employeeID = req.params.employeeID;
    try {
        const hourly = await HourlyEmployee.find({ 
            employee: employeeID 
        })
        .sort({ day: 1 })
        .sort({ hourStart: 1 })
        .exec();
        return hourly;
    }
    catch (error) {
        throw error;
    }
}

const deleteHourly = async (req, res) => {
    const hourlyID = req.params.hourlyID;
    try {
        const hourly = await HourlyEmployee.findByIdAndDelete(hourlyID);
        if (!hourly) {
            throw new HttpError("Cette horaire de travail n'existe pas", 400);
        }
        return hourly;
    } 
    catch (error) {
        throw error;
    }
};

module.exports = {
    createHourlyEmployee,
    allHourly,
    deleteHourly
}
