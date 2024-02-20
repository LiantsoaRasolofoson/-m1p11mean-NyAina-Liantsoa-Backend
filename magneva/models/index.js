var dbConfig = require("../config/db.config.js");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise

const db = {};
db.mongoose = mongoose;
db.uri = dbConfig.uri;

db.user = require("./user.model.js");
db.role = require("./role.model.js")
db.openingHour = require("./openingHour.model.js");

db.ROLES = ["user", "employee", "admin"]

module.exports = db;
