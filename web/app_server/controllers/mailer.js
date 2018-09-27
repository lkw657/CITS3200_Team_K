const nodemailer = require('nodemailer');
var mailModel = require('../models/mails');
var Mail = mailModel.mailSchema;


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

module.exports.sendFormAccessEmail = (text, to, formID) => {

    var mail = new Mail();
    mail.type = "form-access";
    mail.formID = formID;
    mail.generateSecret((secret)=>{
        mail.secret = secret;
        mail.save((err, mail) => {
            if (err) {
                // something
                console.log(err);
            }
            else {
                var subject = "Access for Form";
                var html = text;
                html += `Here is your access link: http://localhost/formAccess/${mail._id}/${secret}`;
                module.exports.sendEmail(to, subject, html);
            }
        });
    });


};

// ***************
// ROUTING
// ***************
//req.body.mailID
//req.body.secret
//req.body.userID
module.exports.verifyFormAccess = (req, res, next) => {
    if (req.body.mailID && req.body.secret && req.body.userID) {
        Mail.findById(req.body.mailID, (err, mail) => {
            if (err) {
                sendJsonResponse(res, 404, {
                    error: "forbidden"
                });
                console.log(err);
            }
            else if (!mail) {
                sendJsonResponse(res, 403, {
                    error: "forbidden"
                });
            }
            else {
                if(mail.status== "done")
                {
                    sendJsonResponse(res, 403, {
                        error: "Link already used"
                    });
                }
                else if (mail.secret == req.body.secret && mail.type == 'form-access') {
                    // give userID access to mail.formID
                    require('./users').addFormToUser(req.body.userID, mail.formID);

                    //Deactivate email
                    mail.status = "done";
                    mail.save((err, mail)=>{
                        console.log(err)
                    })

                    sendJsonResponse(res, 200, {
                        status: "success"
                    });
                }
                else{
                    sendJsonResponse(res, 403, {
                        error: "forbidden - 2"
                    });
                }
            }
        })
    }
    else {
        sendJsonResponse(res, 400, {
            error: "no formId or hash"
        });
    }
}

module.exports.listAllMail = (req, res, next) => {
    Mail.find({}, '', (err, mails) => {
        if (!mails) {
            sendJsonResponse(res, 403, {
                error: "forbidden"
            });
        }
        else if (err) {
            sendJsonResponse(res, 404, {
                error: "forbidden"
            });
            console.log(err);
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
