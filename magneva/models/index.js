var dbConfig = require("../config/db.config.js");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise

const db = {};
db.mongoose = mongoose;
db.uri = dbConfig.uri;

db.user = require("./user.model.js");
db.openingHour = require("./openingHour.model.js");
db.role = require("./role.model.js");
db.service = require("./service.model.js");
db.serviceEmployee = require("./serviceEmployee.model.js");
db.appointment = require("./appointment.model.js");
db.appointmentDetails = require("./appointmentDetails.model.js");
db.salary = require("./salary.model.js");
db.expenseCategory = require("./expense-category.model.js");
db.expense = require("./expense.model.js");
db.piece = require("./piece.model.js");
db.purchase = require("./purchase.model.js");
db.review = require("./review.model.js");
db.specialOffer = require("./specialOffer.model.js");
db.hourlyEmployee = require("./hourlyEmployee.model.js");

db.ROLES = ["user", "employee", "admin"]

module.exports = db;
