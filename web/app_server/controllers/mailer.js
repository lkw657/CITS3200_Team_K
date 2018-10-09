const nodemailer = require('nodemailer');
var mailModel = require('../models/mails');
var Mail = mailModel.mailSchema;

var emailModel = require('../models/emails');
var Email = emailModel.emailSchema;

const email = process.env.SMTP_EMAIL;
const pass = process.env.SMTP_PASSWORD;

var transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    auth: {
        user: email,
        pass: pass
    }
});

module.exports.sendEmail = (to, subject, html) => {

    var mailOptions = {
        from: email,
        to: to,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });

};

module.exports.sendFormAccessEmail = (form, roleToSend) => {
    Email.findOne({ role: roleToSend }, (err, email) => {
        if (err) {
            console.log(err);
            return;
        }
        else if (!email) {
            console.log("No Such Email in DB");
            return;
        }

        var mail = new Mail();
        mail.type = "form-access";
        mail.formID = form._id;
        mail.generateSecret((secret) => {
            mail.secret = secret;
            mail.save((err, mail) => {
                if (err) {
                    // something
                    console.log(err);
                }
                else {
                    var subject = "Access for Form";
                    var html = email.emailContent+'<br>';
                    html += `Here is your access link: http://localhost:4200/verify/${mail._id}/${secret}`;
                    
                    module.exports.sendEmail(email.email, subject, html);
                }
            });
        });
    });
};

// ***************
// ROUTING
// ***************
//req.body.mailID
//req.body.secret


//req.user._id
module.exports.verifyFormAccess = (req, res, next) => {
    if (req.body.mailID && req.body.secret && req.user) {
        Mail.findById(req.body.mailID, (err, mail) => {
            if (err) {
                return res.status(404).json({
                    success: false,
                    msg: "Forbidden"
                });
            }
            else if (!mail) {
                return res.status(403).json({
                    success: false,
                    msg: "Forbidden"
                });
            }
            else {
                if (mail.status == "done") {
                    return res.status(403).json({
                        success: false,
                        msg: "Link already used"
                    });
                }
                else if (mail.secret == req.body.secret && mail.type == 'form-access') {
                    // give userID access to mail.formID
                    require('./users').addFormToUser(req.user._id, mail.formID);

                    //Deactivate email
                    mail.status = "done";
                    mail.save((err, mail) => {
                        console.log(err)
                    })
                    return res.status(200).json({
                        success: true,
                        msg: "Success"
                    });
                }
                else {
                    return res.status(403).json({
                        success: false,
                        msg: "Forbidden"
                    });
                }
            }
        })
    }
    else {
        return res.status(400).json({
            success: false,
            msg: "No formId or hash"
        });
    }
}

module.exports.listAllMail = (req, res, next) => {
    Mail.find({}, '', (err, mails) => {
        if (!mails) {
            return res.status(403).json({
                success: false,
                msg: "Forbidden"
            });
        }
        else if (err) {
            return res.status(404).json({
                success: false,
                msg: err
            });
        }
        else {
            sendJsonResponse(res, 200, mails);
        }
    })
}

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}
