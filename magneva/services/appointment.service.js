const db = require("../models");
const Appointment = db.appointment;
const AppointmentDetails = db.appointmentDetails;
const OpeningHour = db.openingHour;
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const HttpError = require('../httperror');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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

const createAppointment = async (req, res) => {
    let data = req.body;
    data.date = new Date(data.date);
    data.hour = moment(data.hour, "HH:mm").format("HHmm");

    try{
        checkDate(data.date);
        await checkHour(data.date, data.hour);
    
        //create the appointment
        let appointment = new Appointment ({
            date : data.date,
            hour : data.hour,
            user: data.userId
        })
        await appointment.save();
       return appointment;   

    }catch(err){
        throw err;
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
    const tasks = await AppointmentDetails.find(filter)
    .populate('service')
    .populate('client')
    .populate({
        path: 'appointment',
        match: {
            date: { 
                $eq: date.toISOString().split('T')[0] // Filtrer les rendez-vous pour la date d'aujourd'hui
            }
        }
    })
    .sort({ hourBegin: 1 })
    .exec();

    // .populate({
    //     path: 'appointment',
    //     match: { date: date.toISOString().split('T')[0] }
    // })
    // const tasks = await AppointmentDetails.aggregate([
    //     {
    //         $lookup: {
    //             from: "appointments", // Le nom de la collection d'appointments
    //             localField: "appointment",
    //             foreignField: "_id",
    //             as: "appointment"
    //         }
    //     },
    //     {
    //         $unwind: "$appointment"
    //     },
    //     {
    //         $match: {
    //             isFinished: 1,
    //             employee: ObjectId("65dc447ccf95340c0db28eec")
    //         }
    //     },
    //     {
    //         $sort: { hourBegin: 1 }
    //     }
    // ]);
    
    return tasks;
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
    let dateFilter = {};
    if (startDate && endDate) {
        dateFilter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
        dateFilter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
        dateFilter.date = { $lte: new Date(endDate) };
    }
    const appointments = await AppointmentDetails.find(filter)
    .populate('service')
    .populate('client')
    .populate({
        path: 'appointment',
        match: dateFilter
    })
    .sort({ date: -1 })
    .exec();
    return appointments;
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

module.exports = {
    createAppointment,
    getAppointments,
    finishTaskEmployee,
    getTaskEmployee,
    getAppointmentEmployee
}