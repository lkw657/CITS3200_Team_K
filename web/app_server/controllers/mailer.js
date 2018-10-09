const nodemailer = require('nodemailer');
var mailModel = require('../models/mails');
var Mail = mailModel.mailSchema;

var emailModel = require('../models/emails');
var Email = emailModel.emailSchema;

const email = process.env.SMTP_EMAIL;
const pass = process.env.SMTP_PASSWORD;

var formModel = require('../models/forms');
var Form = formModel.Form;

var transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    auth: {
        user: email,
        pass: pass
    }
});

function revertForm(backupForm) {
    console.log("reverting");
    Form.findOneAndUpdate({ _id: backupForm._id }, backupForm, (err, form) => {
        if (err) {
            console.log("SOmething is seriously fucked");
        }
    });
}

module.exports.sendEmail = (to, subject, html, res, successMessage, backupForm) => {

    var mailOptions = {
        from: email,
        to: to,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
            if (backupForm) {
                revertForm(backupForm);
            }
            if (res)
                return res.status(400).json({ success: false, msg: "Failed to connect to SMTP Server" });
        }
        else {
            console.log(info);
            return res.status(200).json({ success: true, msg: successMessage });
        }
    });

};

module.exports.sendFormAccessEmail = (form, roleToSend, res, successMessage, backupForm) => {


    Email.findOne({ role: roleToSend }, (err, email) => {
        if (err) {
            console.log(err);
            if (backupForm) {
                revertForm(backupForm);
            }
            if (res)
                return res.status(400).json({ success: false, msg: "Something went wrong!" });
        }
        else if (!email) {
            console.log("No Such Email in DB");
            if (backupForm) {
                revertForm(backupForm);
            }
            if (res)
                return res.status(400).json({ success: false, msg: "Could not find email" });
        }

        var mail = new Mail();
        mail.type = "form-access";
        mail.formID = form._id;
        mail.generateSecret((secret) => {
            mail.secret = secret;
            mail.save((err, mail) => {
                if (err) {
                    console.log(err);
                    if (backupForm) {
                        revertForm(backupForm);
                    }
                    if (res)
                        return res.status(400).json({ success: false, msg: "Failed to mail" });
                }
                else {
                    var subject = "Access for Form";
                    var html = email.emailContent + '<br>';
                    html += `Here is your access link: http://localhost:4200/verify/${mail._id}/${secret}`;

                    module.exports.sendEmail(email.email, subject, html, res, successMessage, backupForm);
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

    console.log(req.body);
    console.log(req.user);

    if (!req.body.mailID) {
        return res.status(403).json({
            success: false,
            msg: "No mailID"
        });
    }
    if (!req.body.secret) {
        return res.status(403).json({
            success: false,
            msg: "No secret"
        });
    }
    if (!req.user) {
        return res.status(403).json({
            success: false,
            msg: "Invalid user"
        });
    }


    Mail.findById(req.body.mailID, (err, mail) => {
        if (err) {
            console.log(err);
            return res.status(404).json({
                success: false,
                msg: "forbidden"
            });
        }
        else if (!mail) {
            return res.status(403).json({
                success: false,
                msg: "no such mail"
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
                    if (err || !mail) {
                        return res.status(403).json({
                            success: false,
                            msg: err
                        });
                    }
                    else {
                        return res.status(200).json({
                            success: true,
                            msg: "Success"
                        });
                    }
                })
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
