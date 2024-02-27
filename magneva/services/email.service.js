const nodemailer = require('nodemailer');

// host: "smtp.gmail.com",
    // secureConnection: false,
    // port:587,
    // secure: true,
    // auth: {
    //     user: 'liantsoarasolofoson@gmail.com',
    //     pass: 'kospadyufathfqlg'
    // },
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

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "liantsoarasolofoson@gmail.com",
    to: to,
    subject: subject,
    text: text
  };
  try {
    await transporter.sendMail(mailOptions, (error, info)  => {
        if(error){
            console.log('Error :', error);
        }else{
            console.log('E-mail envoyé avec succès :', info.response);
        }
    });
  } 
  catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
  }
}

module.exports = {
    sendEmail
}

  