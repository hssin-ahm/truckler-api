const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = { ...err }

    error.message = err.message;
    // Log to console for dev
    console.log(err);

    //Mongose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found with id of ' + error.value
        error = new ErrorResponse(message, 404);
    }

    // Mongoose Mongoose duplicate key 

    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    //Mongoose validation Error
    if (err.name == 'validationError') {
        const messsage = Object.values(err.errors).map(val => val.messsage)
        error = new ErrorResponse(message, 400)
    }
      
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'server error'
    });
}

module.exports = errorHandler;