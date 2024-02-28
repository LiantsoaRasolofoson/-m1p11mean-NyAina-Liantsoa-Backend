const HttpError = require("../httperror");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'liantsoarasolofoson@gmail.com',
        pass: 'kospadyufathfqlg'
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = (to, subject, text) => {
  try {
    const mailOptions = {
      from: "liantsoarasolofoson@gmail.com",
      to: to,
      subject: subject,
      html: text
    };
    transporter.sendMail(mailOptions, (error, info)  => {
      if(error){
        throw new HttpError("Erreur lors de l'envoie d'email: "+error, 400);
      }
    });
  } 
  catch (error) {
    throw error;
  }
}

module.exports = {
  sendEmail
}

  