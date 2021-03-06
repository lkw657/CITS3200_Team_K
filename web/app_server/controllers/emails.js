
var emailModel = require('../models/emails');
var Email = emailModel.emailSchema;

var mailModel = require('../models/mails');
var Mail = mailModel.mailSchema;

//Lists all emails
module.exports.listAllEmails = (req, res, next) => {
    if (req.user == undefined || !req.user.isIT) {
        var stat = req.user == undefined ? 401 : 403
        return res.status(stat).json({
            success: false,
            msg: "You do not have permission to access this page"
        });
    }
    Email.find({}, (err, mails) => {
        if (!mails) {
            return sendJsonResponse(res, 403, {
                error: err
            });
        }
        else if (err) {
            return sendJsonResponse(res, 400, {
                error: err
            });
        }
        else {
            return sendJsonResponse(res, 200, mails);
        }
    });
}


//Add email list
//req.body.role
//req.body.email
module.exports.addEmail = (req, res, next) => {
    // CHECK IF ADMIN
    if (req.user == undefined || !req.user.isIT) {
        var stat = req.user == undefined ? 401 : 403
        return res.status(stat).json({
            success: false,
            msg: "You do not have permission to access this page"
        });
    }

    console.log(req.body);
    if (!req.body.email && !req.body.role && !req.body.emailContent && !req.body.subject) {
        return res.status(400).json({ success: false, msg: 'Missing Data' });
    }

    var email = new Email();
    email.role = req.body.role;
    email.email = req.body.email;
    email.emailContent = req.body.emailContent;
    email.subject = req.body.subject;

    email.save((err, email) => {
        if (err) {
            return res.status(400).json({ success: false, msg: err });
        }
        else {
            return res.status(200).json({ success: true, msg: "New email added succesfully!" });
        }
    });
}

//Updates user information in database
module.exports.updateEmail = (req, res, next) => {
    // CHECK IF ADMIN
    if (req.user == undefined || !req.user.isIT) {
        var stat = req.user == undefined ? 401 : 403
        return res.status(stat).json({
            success: false,
            msg: "You do not have permission to access this page"
        });
    }

    Email.findById(req.body._id, function (err, email) {
        if (err) {
            return res.json({ success: false, msg: 'Could not find email' });
        };

        email.role = req.body.role;
        email.email = req.body.email;
        email.emailContent = req.body.emailContent;
        email.subject = req.body.subject;

        email.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: 'Could not update email' });
            }
            return res.json({ success: true, msg: 'Email Updated' });
        });
    });
}

//Delete Email from database
module.exports.removeEmail = (req, res, next) => {
    // CHECK IF ADMIN
    if (req.user == undefined || !req.user.isIT) {
        var stat = req.user == undefined ? 401 : 403
        return res.status(stat).json({
            success: false,
            msg: "You do not have permission to access this page"
        });
    }

    Email.findById(req.body._id, function (err, email) {

        if (err) {
            return res.json({ success: false, msg: 'Could not find email' });
        };

        email.remove(function (err) {
            if (err) {
                return res.json({ success: false, msg: 'Could not delete email' });
            }
            else {
                return res.json({ success: true, msg: 'Email has been removed!' });
            }

        });
    });
}

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}

