const { validationResult, matchedData } = require('express-validator');

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
        return res.status(400).send({ error: concatErrorMessage(result.array())});
    }
    req.matchedData = matchedData(req);
    next();
}

module.exports = {
    check
}

