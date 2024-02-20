var authService = require("./auth.service");
var employeeService = require("./employee.service");
var serviceService = require("./service.service");

const service = {};
service.authService = authService;
service.employeeService = employeeService;
service.serviceService = serviceService;

module.exports = service;

