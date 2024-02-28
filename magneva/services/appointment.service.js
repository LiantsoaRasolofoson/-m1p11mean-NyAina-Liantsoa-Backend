const db = require("../models");
const Appointment = db.appointment;
const AppointmentDetails = db.appointmentDetails;
const OpeningHour = db.openingHour;
const Service = db.service;
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const HttpError = require('../httperror');

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

const findById = async (id) => {
    return await Appointment.findOne({ _id : id });
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
        match: { date: date.toISOString().split('T')[0] }
    })
    .sort({ hourBegin: 1 })
    .exec();
    return tasks;
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

const rearrangeDetails = (appointment, newDetails, order) => {
    // if there is any details yet
    if(details.length == 0){
        newDetails.hourBegin = appointment.hour;
        newDetails.hourEnd = appointment.hour + newDetails.service.duration
        return [newDetails];
    }
    
    //create an array where [0] is the sooner
    let rearrangedDetails = [];
    details = appointment.appointmentDetails.sort((a, b) => a.hourBegin - b.hourBegin);
    let hourBegin = appointment.hour;
     
    for(let i =0; i<details.length; i++){
        let tmp;
        if(i == order) {
            tmp = newDetails ;
            i--;
            order = -1;
        }else{
            tmp = details[i];
        }
       tmp.hourBegin = hourBegin;
       tmp.hourEnd = hourBegin + tmp.service.duration;
       hourBegin = tmp.hourEnd;
       rearrangedDetails.push(tmp);
    }

    if(order == details.length){
        newDetails.hourBegin = hourBegin;
        newDetails.hourEnd = hourBegin + newDetails.service.duration;
        rearrangedDetails.push(newDetails);
    }

    return rearrangedDetails;
}

const checkEmployeesAvailability = async (appointmentDetails) =>{
    for(let i = 0; i < appointmentDetails.length; i++){
        let details = appointmentDetails[i];
        let result = await AppointmentDetails.find({
            $and: [
              { employee: details.employee },
              { appointment: { $ne: details.appointment } },
              { date: details.date  },
              {
                $or: [
                  { hourBegin: { $gt: details.hourBegin , $lt: details.hourEnd } },
                  { hourEnd: { $gt: details.hourBegin, $lt: details.hourEnd } }
                ]
              }
            ]
        }).exec()
        if(result){
            let momentBegin = moment(details.hourBegin, "HHmm").format("HH:mm");
            let momentEnd = moment(details.hourEnd, "HHmm").format("HH:mm");
            throw new HttpError(`Notre membre ${details.employee.name} 
            ${details.employee.firstName} n'est pas libre pour le service ${details.name} a ${momentBegin} - ${momentEnd}. `, 400);
        }
    }
}

// {
//     service : xxx,
//     employee : yyy,
//     order : n / 1 <= n <= X
//     client : ddd,
//     appointment : sss
// }
//
const createAppointmentDetails = async (data) => {
    try{
          //get the appropriate appointment
        let appointment = await Appointment.findOne({ _id : data.appointment })
        .populate({
            path: 'appointmentDetails',
            populate: {path:'service', select:'name price duration' }
        }).populate({
            path: 'appointmentDetails',
            populate: {path:'employee', select:'name firstName' }
        })
        exec();

        let service = await Service.findOne({ _id : newAppointmentDetails.service })
        .select("name price duration").exec();

        let newAppointmentDetails = {
            service: data.service,
            employee: data.employee,
            client: data.client,
            appointment: data.appointment
        }

        newAppointmentDetails.service = service;
        newAppointmentDetails.date = date;

        //temporary rearrange the details
        let rearrangedDetails = rearrangeDetails(appointment, newAppointmentDetails, data.order - 1)
        //check if every employee is free for the new order (loop every appointment details)
        await checkEmployeesAvailability(rearrangedDetails);
        //rearrange  all the appointment details and insert the new one



    }catch(err){
        throw err
    }
   
}

module.exports = {
    createAppointment,
    getAppointments,
    findById,
    finishTaskEmployee,
    getTaskEmployee
}