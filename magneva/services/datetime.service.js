const moment = require('moment');
const momentTimezone = require('moment-timezone');


const timezone = 'Indian/Antananarivo';

const getCurrentDate = (format) => {
    return momentTimezone.tz(timezone).format(format);
}

const convertToTimezoneDate = (date, format) => {
    return  momentTimezone.tz(date, timezone).format(format);
}

const getCurrentTime = (format) => {
    return momentTimezone.tz(timezone).format(format);
}

const formatToReadableHour = (hour) => {
    return moment(hour, "HHmm").format("HH:mm");
}


module.exports = {
    getCurrentDate,
    convertToTimezoneDate,
    getCurrentTime,
    formatToReadableHour
}