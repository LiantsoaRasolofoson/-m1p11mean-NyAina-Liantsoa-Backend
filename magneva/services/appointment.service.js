const db = require("../models");
const Appointment = db.appointment;
const AppointmentDetail = db.appointmentDetails;
const OpeningHour = db.openingHour;
const Service = db.service;
const ServiceEmployee = db.serviceEmployee;
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const HttpError = require('../httperror');
const serviceService = require('./service.service');

const checkHour = async (date, hour) => {
    let openingHour = await OpeningHour.findOne({ day: date.getDay() }).exec();
    if(openingHour.isClosed || hour < openingHour.hourOpen || hour > openingHour.hourClose){
        throw new HttpError('Désolé, mais nous ne sommes pas encore ouverts à cette heure.', 400);
    }

    let currentTime = momentTimezone.tz('Indian/Antananarivo');
    if(hour < currentTime.format("HHmm") && currentTime.format("YYYY-MM-DD") == convertToTimezoneDate(date)){
        throw new HttpError('Veuillez choisir une heure exacte.', 400);
    }
}

const checkDate = (date) => {

    if(convertToTimezoneDate(date) < getCurrentDate()){
        throw new HttpError("Veuillez choisir une date valide", 400);
    }
}

const createAppointment = async (data) => {
    // TODO: Wrap in a transaction
    data.date = new Date(data.date);
    data.hour = moment(data.hour, "HH:mm").format("HHmm");
    let session;
    try{
        // Using Mongoose's default connection
        session = await db.mongoose.startSession();
        console.log(session);

        checkDate(data.date);
        await checkHour(data.date, data.hour);
        
        session.startTransaction();
        //create the appointment
        console.log('create appointment');
        let appointment = new Appointment ({
            date : data.date,
            hour : data.hour,
            user: data.userId
        })
        await appointment.save();

        let hourBegin = data.hour;
        let details = [];
        for(let i=0; i < data.services.length; i++ ){
            
            let tmp = new AppointmentDetail ({
                service : data.services[i].entity._id,
                employee : data.services[i].employee.entity._id,
                price : data.services[i].entity.price,
                reduction : serviceService.getReduction(),
                hourBegin : hourBegin,
                hourEnd : hourBegin + parseInt(data.services[i].entity.duration),
                client : data.userId ,
                appointment : appointment._id
            })
            hourBegin = hourBegin + parseInt(data.services[i].entity.duration);
            await tmp.save();
            details.push(tmp);
        }

        appointment.appointmentDetails = details;
        await session.commitTransaction();
        await appointment.save();
        console.log('Appointment saved');
       return appointment;   
    }catch(err){
        console.log('Aborting');
        await session.abortTransaction();
        throw err;
    }finally{
        console.log('End session');
        console.log(session);
        await session.endSession();
    }
}

const getAppointments = async (req, res) => {
    return await Appointment.find({  user : req.query.userId });
}

const getCurrentDate = () => {
    return momentTimezone.tz('Indian/Antananarivo').format("YYYY-MM-DD");
}

const convertToTimezoneDate = (date) => {
    return  momentTimezone.tz(date, 'Indian/Antananarivo').format("YYYY-MM-DD");
}

const getTaskEmployee = async(date, employeeID, isFinished) => {
    let filter = {
        employee: employeeID,
        isFinished: isFinished
    };
    const tasks = await AppointmentDetail.find(filter)
    .populate('service')
    .populate('client')
    .populate('appointment')
    .sort({ hourBegin: 1 })
    .exec();

    const filteredTasks = tasks.filter(task => 
        task.appointment && task.appointment.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );

    return filteredTasks;
}

const getAppointmentEmployee = async(employeeID, startDate, endDate, isFinished) => {
    let filter = {
        employee: employeeID
    };
    if (isFinished !== null && isFinished !== '') {
        const parseIsFinished = parseInt(isFinished);
        if (!isNaN(parseIsFinished)) {
            filter.isFinished = parseIsFinished;
        }
    };
    const appointments = await AppointmentDetails.find(filter)
    .populate('service')
    .populate('client')
    .populate('appointment')
    .sort({ date: -1 })
    .exec();
    const filteredRDV = appointments.filter(appointment => {
        const appointmentDate = appointment.appointment && appointment.appointment.date;
        if (appointmentDate) {
            if (startDate && endDate) {
                return appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
            } else if (startDate) {
                return appointmentDate >= new Date(startDate);
            } else if (endDate) {
                return appointmentDate <= new Date(endDate);
            }
        }
        return true;
    });
    return filteredRDV;
}

const finishTaskEmployee = async(req, res) => {
    const appointmentDetailID = req.params.appointmentDetailID;
    try{
        const appointmentDetail = await AppointmentDetails.findOne({_id: appointmentDetailID}).exec();
        if(!appointmentDetail) {
            throw new HttpError("Cette tâche n'existe pas", 400);
        }
        appointmentDetail.isFinished = 1;
        await appointmentDetail.save();
        return appointmentDetail;
    }
    catch(error){
        throw error;
    }
}

const mapEmployeesByService = async (emps) => {
    let result = {};
    let services = await Service.find({}).exec();
    //init the result
    for(let i = 0; i < services.length; i++){
        result[services[i]._id] = [];
    }

    for(let i = 0; i < emps.length; i++){
        //get all the emps services
        let empServices = (await ServiceEmployee.findOne({ employee : emps[i].entity._id}).exec()).services;
        for(let j=0 ; j < empServices.length; j++){
           result[empServices[j]].push(emps[i]);
        }
    }
    return result;
}

const getCreateDatas = async (services, employees) => {
    let jsonResponse = {};
    jsonResponse.services = services;
    jsonResponse.employees = await mapEmployeesByService(employees);
    return jsonResponse;
}

module.exports = {
    createAppointment,
    getAppointments,
    finishTaskEmployee,
    getTaskEmployee,
    getAppointmentEmployee,
    getCreateDatas
}