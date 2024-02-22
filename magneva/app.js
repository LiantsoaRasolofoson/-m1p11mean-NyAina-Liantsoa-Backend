var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var homeController = require('./controllers/home.controller');
var authController = require('./controllers/auth.controller');
var userController = require('./controllers/user.controller');
var managerController = require('./controllers/manager.controller');
var serviceController = require('./controllers/service.controller');
var appointmentController = require('./controllers/appointment.controller');
const cors = require("cors");

var app = express();
const cors = require("cors")

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// Setting the controller
app.use('/', homeController);
app.use('/auth', authController);
app.use('/user', userController);
app.use('/manager', managerController);
app.use('/service', serviceController);
app.use('/appointment', appointmentController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.statusCode || 500).json(
    { 
      error:  err.errorCode || 'Internal Server Error',
      message: err.message,
      statusCode: err.statusCode || 500
    });
});

module.exports = app;
