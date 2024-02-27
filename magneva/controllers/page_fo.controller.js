const router = require("express").Router();
const {appointmentService, dateTimeService} = require("../services")

router.get("/appointment-details/:id", async (req, res, next) => {
    let jsonResponse = {};
    try{
        let appointment = await appointmentService.findById(req.params.id);
        
        jsonResponse.appointment = appointment;

        jsonResponse.readableDate =  new Date(appointment.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        jsonResponse.isDatetimeAlreadyPassed = 
        (dateTimeService.convertToTimezoneDate(appointment.date, "YYYY-MM-DD") <= dateTimeService.getCurrentDate("YYYY-MM-DD"))
        && (appointment.hour < dateTimeService.getCurrentTime("HHmm"));

        jsonResponse.hour = dateTimeService.formatToReadableHour(appointment.hour);

        res.status(200).send(jsonResponse);
    }catch(err){
        next(err)
    }
})


module.exports = router;