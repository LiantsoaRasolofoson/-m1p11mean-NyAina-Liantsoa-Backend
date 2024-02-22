const { validationResult, matchedData } = require('express-validator');
const HttpError = require('../httperror');

const concatErrorMessage = (errors) => {
    let error = "";
    errors.forEach(err => {
        error += err.msg + "\n ";
    })
    return error;
}


check = (req, res, next) => {
    const result = validationResult(req);
    if(!result.isEmpty()){
        console.log("test");
        throw new HttpError(concatErrorMessage(result.array()), 400);
    }
    req.matchedData = matchedData(req);
    next();
}

module.exports = {
    check
}

