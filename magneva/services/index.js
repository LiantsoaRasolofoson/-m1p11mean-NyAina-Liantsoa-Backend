var authService = require("./auth.service");
var employeeService = require("./employee.service");
var serviceService = require("./service.service");
var appointmentService = require("./appointment.service");
var expenseService = require("./expense.service");
var pieceService = require("./piece.service");
var purchaseService = require("./purchase.service");

const service = {};
service.authService = authService;
service.employeeService = employeeService;
service.serviceService = serviceService;
service.appointmentService = appointmentService;
service.expenseService = expenseService;
service.pieceService = pieceService;
service.purchaseService = purchaseService;

module.exports = service;

