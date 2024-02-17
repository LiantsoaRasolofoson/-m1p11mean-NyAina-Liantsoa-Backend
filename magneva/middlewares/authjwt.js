var jwt = require("jsonwebtoken");
var config = require("../config/auth.config.js");

const setAccessControlAllowHeader = (req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, Content-Type, Accept"
    );
    next();
}

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if(!token){
        return res.status(403).send({ message: "Absence de token" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({
                message: "Token invalide"
            });
        }
        req.userId = decoded.id;
        req.roles = decoded.roles;
        next();
    })
}

const checkUser = (res, next, roles, roleRequired) => {
    if(roles.some(role => role.name === roleRequired)){
        next();
    } else {
        return res.status(401).send({message: "Utilisateur n'a pas le role requise"});
    }
}

isAdmin = (req, res, next) => {
   checkUser(res, next, req.roles, "admin");
}

isEmployee = (req, res, next) => {
    checkUser(res, next, req.roles, "employee");
}

isUser = (req, res, next) => {
    checkUser(res, next, req.roles, "user");
}

const authJwt = {
    setAccessControlAllowHeader,
    verifyToken,
    isAdmin,
    isEmployee,
    isUser
};

module.exports = authJwt;