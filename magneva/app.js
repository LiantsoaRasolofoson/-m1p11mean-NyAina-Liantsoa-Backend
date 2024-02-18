var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var homeController = require('./controllers/home.controller');
var authController = require('./controllers/auth.controller');
var userController = require('./controllers/user.controller');
var managerController = require('./controllers/manager.controller');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Setting the controller
app.use('/', homeController);
app.use('/auth', authController);
app.use('/user', userController);
app.use('/manager', managerController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);

  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
