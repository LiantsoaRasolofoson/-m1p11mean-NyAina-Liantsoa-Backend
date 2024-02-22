class HttpError extends Error {


    errorMeaning = {
        500: 'Internal Server Error',
        400: 'Bad request',
        404: 'Not found'
    }

    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.errorCode = this.errorMeaning[statusCode];
    }
}

module.exports = HttpError;