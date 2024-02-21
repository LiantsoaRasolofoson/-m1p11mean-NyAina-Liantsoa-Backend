var authService = require("./auth.service");
var employeeService = require("./employee.service");
var serviceService = require("./service.service");
var appointmentService = require("./appointment.service");

const service = {};
service.authService = authService;
service.employeeService = employeeService;
service.serviceService = serviceService;
service.appointmentService = appointmentService;

module.exports = service;

