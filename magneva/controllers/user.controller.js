const express = require("express");
const route = express.Router();
const { authJwt } = require("../middlewares");

route.get("/test/usercontent", [ authJwt.setAccessControlAllowHeader, authJwt.verifyToken, authJwt.isUser ] ,(req, res) => {
    res.send({message: "user content"});
});

route.get("/test/employeecontent", [ authJwt.setAccessControlAllowHeader, authJwt.verifyToken, authJwt.isEmployee ],  (req, res) => {
    res.send({message: "employee content"});
});

route.get("/test/admincontent", [ authJwt.setAccessControlAllowHeader, authJwt.verifyToken, authJwt.isAdmin ], (req, res) => {
    res.send({message: "admin content"});
});

module.exports = route;