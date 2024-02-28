const router = require("express").Router();
const { emailService } = require('../services');

router.post("/sendEmail", (req, res, next) => {
    try{
        to= "liantsoarasolofoson@gmail.com";
        subject= "Test d\'envoi d\'e-mail avec Node.js";
        text= "<h1>Ceci est un titre HTML</h1><p>Ceci est un paragraphe HTML</p>";
        res.status(201).send(emailService.sendEmail(to, subject, text));
    }
    catch(error){
        next(error);
    }
});

module.exports = router;