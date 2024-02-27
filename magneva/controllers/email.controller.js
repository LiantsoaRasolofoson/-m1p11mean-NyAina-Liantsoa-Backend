const router = require("express").Router();
const { emailService } = require('../services');

router.post("/sendEmail",  async (req, res, next) => {
    try{
        to= "liantsoarasolofoson@gmail.com";
        subject= "Test d\'envoi d\'e-mail avec Node.js";
        text= "<h1>Ceci est un e-mail de test envoyé avec Node.js.</h1>";
        res.status(201).send(await emailService.sendEmail(to, subject, text));
    }
    catch(error){
        next(error);
    }
});

module.exports = router;