const router = require("express").Router();
const { body } = require('express-validator')
const { verifySignUp, requestValidation } = require('../middlewares')
const { authService } = require('../services');


function setAccessControlAllowHeader(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
}

function signinMiddlewares(){
    return [
        body('email').isEmail().withMessage('Email invalide'),
        body('password').notEmpty().withMessage('Mot de passe requise'),
        requestValidation.check,
        setAccessControlAllowHeader
    ]
}

router.post("/signin", signinMiddlewares(), (req, res) => {
    authService.signIn(req, res);
})

function signUpMiddlewares(){
    return [
        body('name').notEmpty().withMessage('Nom requise.'),
        body('firstName').notEmpty().withMessage('Prenom requise'),
        body('sex').notEmpty(),
        body('password').notEmpty().withMessage('Mot de passe requise'),
        body('email').isEmail().withMessage('Email requise'),
        requestValidation.check,
        setAccessControlAllowHeader
    ]
}

router.post("/signup", signUpMiddlewares(), (req, res) => {
    authService.signUp(req, res);
})

module.exports = router;