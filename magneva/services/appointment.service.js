const db = require("../models");
const Appointment = db.appointment;
const AppointmentDetail = db.appointmentDetails;
const OpeningHour = db.openingHour;
const AppointmentView = db.appointmentView;
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


const getUserAppointments = async (userId) => {
    return await Appointment.find({ user : userId}).exec();
}


const checkEmployeeAvalability = (employeeId, date, hourBegin, hourEnd) => {
    //todo check employee
}



const createAppointment = async (data) => {
    // TODO: Wrap in a transaction
    data.date = new Date(data.date);
    data.hour = parseInt(moment(data.hour, "HH:mm").format("HHmm"));
    console.log(typeof(data.hour));

    let session = await db.mongoose.startSession();
    session.startTransaction();

    try{
        checkDate(data.date);
        await checkHour(data.date, data.hour);
        
        //create the appointment
        console.log('create appointment');
        let appointment = new Appointment ({
            date : data.date,
            hour : data.hour,
            user: data.userId
        })
        await appointment.save();

        let hourBegin = data.hour;
        let sumPrice = 0;
        let duration = 0;
        let details = [];

        for(let i=0; i < data.services.length; i++ ){
            let serviceDuration = parseInt(data.services[i].entity.duration);
            let hourEnd = hourBegin + serviceDuration;
            checkEmployeeAvalability(data.services[i].employee.entity._id, data.date, hourBegin, hourEnd);

            let tmp = new AppointmentDetail ({
                service : data.services[i].entity._id,
                employee : data.services[i].employee.entity._id,
                price : data.services[i].entity.price,
                reduction : serviceService.getReduction(),
                hourBegin : hourBegin,
                hourEnd : hourEnd,
                client : data.userId ,
                appointment : appointment._id
            })
            hourBegin = hourEnd
            await tmp.save();

            duration += serviceDuration;
            sumPrice += parseInt(tmp.price) * (1 - tmp.reduction / 100) ; // add the reduction
            details.push(tmp);
        }

        appointment.sumPrice = sumPrice;
        appointment.duration = duration;
        appointment.appointmentDetails = details;
        await appointment.save();

        await session.commitTransaction();
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

//minPrice
//maxPrice
//startDate
//endDate
//startHour
//endHour
//page
const getAppointments = async (query) => {
    const searchCriteria = {};
    let jsonResponse = {};

    if(query.user && query.user.trim() ){
        searchCriteria['user'] = { $regex: query.user.trim(), $options: 'i' };
    }

    if(query.minDate && query.minDate.trim()) {
        searchCriteria['date'] = { $gte: query.minDate }
    }

    if(query.maxDate && query.maxDate.trim()){
        searchCriteria['date'] = { ...searchCriteria['date'], $lte: query.maxDate }
    }

    if(query.minHour && query.minHour.trim()){
        searchCriteria['hour'] = { $gte: moment(query.minHour, "HH:mm").format("HHmm") };
    }

    if(query.maxHour && query.maxHour.trim() ){
        searchCriteria['hour'] = { ...searchCriteria['hour'], $lte: moment(query.maxHour, "HH:mm").format("HHmm") };
    }

    if (query.minPrice && query.minPrice.trim()) {
        searchCriteria['sumPrice'] = { $gte: parseInt(query.minPrice) };
    }

    if (query.maxPrice && query.maxPrice.trim()) {
        searchCriteria['sumPrice'] = { ...searchCriteria['sumPrice'], $lte: parseInt(query.maxPrice) };
    }
      
    if(query.isPaid && query.isPaid.trim() ){
        let convert = {};
        convert.true = true;
        convert.false = false;
        searchCriteria['isPaid'] = convert[query.isPaid];
    }
    console.log(searchCriteria);

    jsonResponse.entities = await AppointmentView.find(searchCriteria)
    .skip((query.page - 1) * query.pageSize)
    .limit(query.pageSize)
    .exec();
    jsonResponse.count = await AppointmentView.countDocuments(searchCriteria).exec();

    return jsonResponse;
}

const getAppointment = async (id) => {
    return await Appointment.findOne({ _id : id})
    .populate({
        path: 'appointmentDetails',
        populate: [
        {
            path: 'employee',
            select: 'name firstName'
        },
        {
            path: 'service',
            select: 'name duration'
        } ]
    })
    .exec();
}

const isAlreadyPassed = (appointment) => {
    let currentDate = getCurrentDate();
    let currentTime = parseInt(momentTimezone.tz('Indian/Antananarivo').format("HHmm"));
    let appointmentDate = convertToTimezoneDate(new Date(appointment.date));
    return appointmentDate <= currentDate && appointment.hour < currentTime;
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
    const appointments = await AppointmentDetail.find(filter)
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
        const appointmentDetail = await AppointmentDetail.findOne({_id: appointmentDetailID}).exec();
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
    getCreateDatas,
    getAppointment,
    isAlreadyPassed,
    getUserAppointments
}