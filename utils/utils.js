require("dotenv").config()
var nodemailer = require('nodemailer');

const sendNoteViaMail = async (receiver, body) => {
    var transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASSWORD
        }
      });
      //check@test123
      
      var mailOptions = {
        from: process.env.GMAIL_ID,
        to: receiver,
         subject: 'Sending Email using Personnal App',
        text: `
            Hi,
            This is to remind you that you have a reminder from your friend. 
            Note Title: ${body.title}.
            Note Details: ${body.description}

            Regards, 
            Personal Note Maker App
            `
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {
    sendNoteViaMail
}
