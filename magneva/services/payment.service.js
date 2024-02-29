const HttpError = require("../httperror");
const db = require("../models");
const Payment = db.payment;
const AppointmentView = db.appointmentView;
const Appointment = db.appointment;

const createPayment = async (req, res) => {
    let data = req.body;
    try {
        const appointment = await AppointmentView.findOne({_id: data.appointment}).exec();
        if(!appointment){
            throw new HttpError("Ce rendez-vous n'existe pas" , 404);
        }
        if( appointment.sumPrice > data.amount){
            throw new HttpError("Le montant à payer est égal à "+appointment.sumPrice+ "Ar" , 400);
        }
        const payment = new Payment({
            appointment: data.appointment,
            amount: data.amount,
            date: data.date
        });
        await payment.save();
        const rdv = await Appointment.findOne({_id: data.appointment}).exec();
        rdv.isPaid = true;
        await rdv.save();
        return appointment; 
    } 
    catch (error) {
        throw error;
    }
};

const getPayments = async (req, res) => {
    try {
        const payements = await Payment.find().exec();
        return payements;
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    createPayment,
    getPayments
}
