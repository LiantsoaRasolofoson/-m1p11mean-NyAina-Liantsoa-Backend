class HttpError extends Error {


    errorMeaning = {
        500: 'Internal Server Error',
        400: 'Bad request'
    }

    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.errorCode = this.errorMeaning[statusCode];
    }
}

module.exports = HttpError;