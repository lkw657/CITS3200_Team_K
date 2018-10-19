const nodemailer = require('nodemailer');
var mailModel = require('../models/mails');
var Mail = mailModel.mailSchema;

var emailModel = require('../models/emails');
var Email = emailModel.emailSchema;

const email = process.env.SMTP_EMAIL;
const pass = process.env.SMTP_PASSWORD;

var formModel = require('../models/forms');
var Form = formModel.Form;

var userModel = require('../models/users');
var User = userModel.User;

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
            console.log("Something has gone really wrong!");
            console.log(err)
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
            if (res && backupForm) {
                // Pop of approvals array of allocated staff

                if (backupForm.allocatedStaff) {
                    User.findById(backupForm.allocatedStaff, (err, staff) => {
                        //delete

                        staff.approvals = staff.approvals.filter(item => JSON.stringify(item) != JSON.stringify(backupForm._id));
                        staff.save((err, staff) => {
                            res.status(200).json({ success: true, msg: successMessage });
                        });
                    });
                }
                else {
                    return res.status(200).json({ success: true, msg: successMessage });
                }
            }

        }
    });

};

module.exports.sendFormAccessEmail = (form, roleToSend, res, successMessage, backupForm, previouslyrejected) => {

    Email.findOne({ role: roleToSend }, (err, email) => {
        if (err) {
            console.log(err);
            if (backupForm) {
                revertForm(backupForm);
            }
            if (res)
                return res.status(400).json({ success: false, msg: "Could not find email" });
            return;
        }
        else if (!email) {
            console.log("No Such Email in DB");
            if (backupForm) {
                revertForm(backupForm);
                console.log(roleToSend);
            }
            if (res)
                return res.status(400).json({ success: false, msg: "Could not find email" });
            return;
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
                    return;
                }
                else {
                    User.findOne({ _id: form.owner }, "fname lname number", function (err, user) {
                        if (err || !user) {
                            if (res)
                                return res.status(400).json({ success: false, msg: "Could not find user" });
                        }
                        else {
                            var subject = email.subject.replace("[first_name]", user.fname)
                                                        .replace("[last_name]", user.lname)
                                                        .replace("[user_number]", user.number)
                                                        .replace("[created_date]", form.dates[0]);
                            //var subject = `Access for RPF form by ${user.fname} ${user.lname} (${user.number}) created on ${form.dates[0]}`;
                            var html = email.emailContent + '<br>';
                            if (previouslyrejected) {
                                html += "The person this was sent to previously rejected responsibility for this form.<br>"
                            }
                            html += `Here is your access link: ${process.env.FRONTEND_URL}verify/${mail._id}/${secret}`;

                            module.exports.sendEmail(email.email, subject, html, res, successMessage, backupForm);

                        }
                    });
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
            msg: "Could not find user"
        });
    }


    Mail.findById(req.body.mailID, (err, mail) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                msg: "You do not have permission to access this page"
            });
        }
        else if (!mail) {
            return res.status(400).json({
                success: false,
                msg: "No such mail"
            });
        }
        else {
            if (mail.status == "done") {
                return res.status(400).json({
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
                    msg: "You do not have permission to access this page"
                });
            }
        }
    })
}

module.exports.rejectFormAccess = (req, res, next) => {
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
            msg: "Could not find user"
        });
    }


    Mail.findById(req.body.mailID, (err, mail) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                msg: "You do not have permission to access this page"
            });
        }
        else if (!mail) {
            return res.status(400).json({
                success: false,
                msg: "No such mail"
            });
        }
        else {
            if (mail.status == "done") {
                return res.status(400).json({
                    success: false,
                    msg: "Link already used"
                });
            }
            else if (mail.secret == req.body.secret && mail.type == 'form-access') {
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
                        // Send email again
                        Form.findById(mail.formID, (err, form) => {
                            var role;

                            if (form.status == 'Awaiting HoS') {
                                role = form.school + ' HoS';

                            }
                            else if (form.status == 'Awaiting AD(R)') {
                                role = 'AD(R)';

                            }
                            else if (form.status == 'Awaiting PVC-ED') {
                                role = 'PVC-ED';
                            }
                            // form, roleToSend, res, successMessage, backupForm, previouslyrejected
                            module.exports.sendFormAccessEmail(form, role, null, null, null, true);
                        })


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
                    msg: "You do not have permission to access this page"
                });
            }
        }
    });
}

module.exports.listAllMail = (req, res, next) => {
    Mail.find({}, '', (err, mails) => {
        if (!mails) {
            return res.status(403).json({
                success: false,
                msg: "You do not have permission to access this page"
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

//********************** PDF CREATION STUFF **********************

module.exports.sendPDFAccessEmail = (form, res, successMessage, backupForm) => {
    Email.findOne({ role: "final" }, (err, email) => {
        if (err) {
            console.log(err);
            if (backupForm) {
                revertForm(backupForm);
            }
            if (res)
                return res.status(400).json({ success: false, msg: "Email not found" });
            return;
        }
        else if (!email) {
            console.log("No Such Email in DB");
            if (backupForm) {
                revertForm(backupForm);
                console.log(roleToSend);
            }
            if (res)
                return res.status(400).json({ success: false, msg: "Email not found" });
            return;
        }

        var mail = new Mail();
        mail.type = "pdf";
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
                    return;
                }
                else {
                    User.findOne({ _id: form.owner }, "fname lname number", function (err, user) {
                        if (err || !user) {
                            if (res)
                                return res.status(400).json({ success: false, msg: "Failed to mail" });
                        }
                        else {
                            var subject = `PDF of RPF form by ${user.fname} ${user.lname} (${user.number}) created on ${form.dates[0]}`;
                            var html = email.emailContent + '<br>';
                            html += `Here is your access link: ${process.env.BACKEND_URL}mail/pdf/${mail._id}/${secret}`;

                            module.exports.sendEmail(email.email, subject, html, res, successMessage, backupForm);

                        }
                    });
                }
            });
        });
    });
}


var ejs = require('ejs');
var path = require('path');
var wkhtmltopdf = require('wkhtmltopdf');

if (process.env.WKHTMLTOPDF) {
    wkhtmltopdf.command = process.env.WKHTMLTOPDF;
}

// /mailID/secret
module.exports.pdfForm = (req, res, next) => {

    console.log(req.params);

    if (!req.params.mailID) {
        return res.status(403).json({
            success: false,
            msg: "No mailID"
        });
    }
    if (!req.params.secret) {
        return res.status(403).json({
            success: false,
            msg: "No secret"
        });
    }


    Mail.findById(req.params.mailID, (err, mail) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                msg: "You do not have permission to access this page"
            });
        }
        else if (!mail) {
            return res.status(400).json({
                success: false,
                msg: "No such mail"
            });
        }
        else {
            if (mail.status == "done") {
                return res.status(400).json({
                    success: false,
                    msg: "Link already used"
                });
            }
            else if (mail.secret == req.params.secret && mail.type == 'pdf') {

                //SendPDF
                Form.findById(mail.formID, "owner approvedBy questionSet answers school submitter dates")
                    .populate({ path: "owner", select: "fname lname number" })
                    .populate({ path: "questionSet" })
                    .populate({ path: "answers" })
                    .populate({ path: 'approvedBy.id', select: "fname lname number" })
                    .exec((err, form) => {
                        if (err) {
                            return res.status(400).json({
                                success: false,
                                msg: "No such form"
                            });
                        }
                        else if (!form) {
                            return res.status(400).json({
                                success: false,
                                msg: "No such form"
                            });
                        }
                        else {

                            QA = [];
                            form.answers.forEach((o, i) => {
                                var temp;
                                if(form.questionSet.questionList[i].type == "money_array_8"){
                                    temp = form.answers[i].answer.split(",");
                                }
                                else{
                                    temp = form.answers[i].answer;
                                }
                                
                                if (form.questionSet.questionList[i].formName == 'central')
                                    QA.push({
                                        question: form.questionSet.questionList[i].text,
                                        title: form.questionSet.questionList[i].title,
                                        answer: temp,
                                        type: form.questionSet.questionList[i].type
                                    })
                            });

                            approvers = []
                            form.approvedBy.forEach((o, i) => {
                                approvers.push({
                                    name: form.approvedBy[i].id.fname + " " + form.approvedBy[i].id.lname,
                                    number: form.approvedBy[i].id.number,
                                    role: form.approvedBy[i].role,
                                    date: form.dates[i + 1]
                                });
                            })
                            data = {
                                QA: QA,
                                approvers: approvers,
                                owner: form.owner,
                                dir: `file:///${__dirname}/../pdf/`
                            };


                            let filePath = `${__dirname}/../pdf/rpf.ejs`;
                            path.format(path.parse(filePath));

                            let renderingOptions = {
                                client: true,
                                rmWhitespace: true
                            };
                            ejs.renderFile(
                                filePath,
                                data,
                                renderingOptions,
                                (err, html) => {
                                    if (err) {
                                        return res.status(400).json({
                                            success: false,
                                            msg: err
                                        });
                                    }
                                    else {

                                        var wkhtmltopdf = require('wkhtmltopdf');

                                        wkhtmltopdf(html, {
                                            marginBottom: "25mm", 
                                            marginLeft: "25mm",
                                            marginRight: "25mm",  
                                            disableSmartShrinking: true, 
                                            pageSize:'A4', 
                                            orientation:'Portrait', 
                                            'headerHtml':__dirname+'/../pdf/header.html', 
                                            'footerHtml':__dirname+'/../pdf/footer.html'
                                        }).pipe(res);
                                    }
                                }
                            );
                        }
                    });

            }
            else {
                return res.status(403).json({
                    success: false,
                    msg: "You do not have permission to access this page"
                });
            }
        }
    });
    /*



        */




}

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}
