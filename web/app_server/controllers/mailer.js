const nodemailer = require('nodemailer');

const email = process.env.SMTP_EMAIL;
const pass = process.env.SMTP_PASSWORD;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: email,
           pass: pass
       }
   });

module.exports.sendEmail = (to, subject, html) =>{

    var mailOptions = {
    from: email, 
    to: to, 
    subject: subject,
    html: html
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
    
};

