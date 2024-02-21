const db = require("../models");
const Appointment = db.appointment;
const OpeningHour = db.openingHour;
const moment = require('moment');
const momentTimezone = require('moment-timezone');

const checkHour = async (date, hour) => {
    let openingHour = await OpeningHour.findOne({ day: date.getDay() }).exec();
    if(openingHour.isClosed || hour < openingHour.hourOpen || hour > openingHour.hourClose){
        console.log('Desole mais nous sommes pas encore ouvert a cet heure');
    }
}

const checkDate = (date) => {
    let currentDate = momentTimezone.tz('Indian/Antananarivo').format("YYYY-MM-DD");
    let timezoneDate = momentTimezone.tz(date, 'Indian/Antananarivo').format("YYYY-MM-DD");
  
    if(timezoneDate < currentDate){
        console.log("Veuillez choisir une date valide");
    }
}

const createAppointment = async (req, res) => {
    let data = req.body;
    data.date = new Date(data.date);
    data.hour = moment(data.hour, "HH:mm").format("HHmm");

    checkDate(data.date);
    await checkHour(data.date, data.hour);
    
    //create the appointment
    let appointment = new Appointment ({
        date : data.date,
        hour : data.hour,
        user: data.userId
    })

    try{
        await appointment.save();
        res.status(200).send("Appointment saved");
    }
    catch(err){
        res.send(err);
    }
}

module.exports = {
    createAppointment
}