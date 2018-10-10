
var emailModel = require('../models/emails');
var Email = emailModel.emailSchema;

var mailModel = require('../models/mails');
var Mail = mailModel.mailSchema;

//Lists all emails
module.exports.listAllEmails = (req, res, next) => {

    Email.find({}, (err, mails) => {
        if (!mails) {
            res.status(403).json({
                success: false,
                msg: "Forbidden"
            });
        }
        else if (err) {
            res.status(404).json({
                success: false,
                msg: err
            });
        }
        else {
            res.status(200).json({
                success: true,
                msg: mails
            });
        }
    });
}


//Add email list
//req.body.role
//req.body.email
module.exports.addEmail = (req, res, next) => {
    // CHECK IF ADMIN
    // if (!req.user) {
    //     return res.status(401).json({
    //         success: false,
    //         msg: "Forbidden"
    //     });
    // }

    if (!req.body.email && !req.body.role) {
        return res.status(400).json({ success: false, msg: 'Missing Data' });
    }

    var email = new Email();
    email.role = req.body.role;
    email.email = req.body.email;
    if (req.body.emailContent) {
        email.emailContent = req.body.emailContent
    }

    email.save((err, email)=>{
        if(err){
            return res.status(400).json({ success: false, msg: err });
        }
        else{
            return res.status(200).json({ success: true, msg: "added email to DB" });
        }
    })


}



var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}