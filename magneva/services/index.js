var authService = require("./auth.service");
var employeeService = require("./employee.service");
var serviceService = require("./service.service");
var appointmentService = require("./appointment.service");
var expenseService = require("./expense.service");
var pieceService = require("./piece.service");
var purchaseService = require("./purchase.service");
var reviewService = require("./review.service");

var emailService = require("./email.service");
var specialOfferService = require("./specialOffer.service");

const service = {};

service.authService = authService;
service.employeeService = employeeService;
service.serviceService = serviceService;
service.appointmentService = appointmentService;
service.expenseService = expenseService;
service.pieceService = pieceService;
service.purchaseService = purchaseService;
service.reviewService = reviewService;

service.emailService = emailService;
service.specialOfferService = specialOfferService;

module.exports = service;

