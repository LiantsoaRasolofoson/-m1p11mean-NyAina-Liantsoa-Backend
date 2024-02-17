const router = require("express").Router();
const { body } = require('express-validator')
const { requestValidation } = require('../middlewares')
const { authService } = require('../services');

function signinMiddlewares(){
    return [
        body('email').isEmail().withMessage('Email invalide'),
        body('password').notEmpty().withMessage('Mot de passe requise'),
        body('role').notEmpty().withMessage('Role requise'),
        requestValidation.check
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
        requestValidation.check
    ]
}

router.post("/signup", signUpMiddlewares(), (req, res) => {
    authService.signUp(req, res);
})

module.exports = router;