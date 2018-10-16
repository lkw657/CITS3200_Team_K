var User = require('../models/users').User;
var Form = require('../models/forms').Form;
var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;
var passport = require('passport')

//This will receive an object containining the below -
// first name: req.body.fname
// last name: req.body.lname
// number: req.body.number,
// password: req.body.password
module.exports.register = (req, res) => {
    // passport-local-mongoose wants the username in a field called username, not email
    //req.body.username = req.body.email
    // TODO better password checks?
    if (req.body.password.length < 8) {
        return res.json({ success: false, msg: 'Passwords must be at least 8 characters long' });
    }
    User.register(User.create(req.body.fname, req.body.lname, req.body.number),
        req.body.password,
        (err, user) => {
            if (err) {
                // Find why the model didn't validate
                if (err.errors) // multiple errors, get first
                    return res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message })
                else
                    return res.json({ success: false, msg: err.message })
            }
            return res.json({ success: true, msg: 'User Registered' });
        }
    );
};


//User Authenticate Route
//This will receive an object containining the below -
// number: req.body.number,
// password: req.body.password
module.exports.authenticate = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user)
            return res.json({ success: false, msg: 'User or password wrong' });
        req.login(user, function (err) {
            if (err) { return next(err); }
            return res.json({
                success: true,
                msg: 'You are successfully logged in',
                user: {
                    fname: user.fname,
                    lname: user.lname,
                    number: user.number,
                    isIT: user.isIT,
                    submissions: user.submissions,
                    approvals: user.approvals
                }
            });
        });
    })(req, res, next);
};

module.exports.logOut = (req, res, next) => {
    req.logout();
    return res.json({
        success: true,
        msg: 'You are successfully logged out!'
    });
};


module.exports.submissions = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({
            success: false,
            msg: "Forbidden"
        });
    User.deepPopulate(req.user, ['submissions', 'submissions.questionSet', 'submissions.owner'], (err) => {
        if (err)
            return res.status(400).json({
                success: false,
                msg: "Error getting submissions"
            });
        var submissions = [];
        for (var i = 0; i < req.user.submissions.length; i++) {
            // For some reason on some computers deepPopulate seems to make this a list, but on others an object
            if (req.user.submissions[i].owner.constructor == Array)
                req.user.submissions[i].owner = req.user.submissions[i].owner[0]
            submissions.push({
                _id: req.user.submissions[i]._id,
                owner: {
                    fname: req.user.submissions[i].owner.fname,
                    lname: req.user.submissions[i].owner.lname,
                    number: req.user.submissions[i].owner.number
                },
                questionSet: req.user.submissions[i].questionSet,
                school: req.user.submissions[i].school,
                submitter: req.user.submissions[i].submitter,
                status: req.user.submissions[i].status,
                answers: req.user.submissions[i].answers,
                history: req.user.submissions[i].history,
                comments: req.user.submissions[i].comments,
                sub_date: req.user.submissions[i].dates[0].toLocaleString('en-AU'),
                action_date: req.user.submissions[i].dates[req.user.submissions[i].dates.length - 1].toLocaleString('en-AU')
            });
        }
        res.json({
            success: true,
            submissions: submissions
        });
    });
}


module.exports.approvals = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({
            success: false,
            msg: "Forbidden"
        });
    User.deepPopulate(req.user, ['approvals', 'approvals.questionSet', 'approvals.owner'], (err) => {
        if (err)
            return res.status(400).json({
                success: false,
                msg: "Error getting approvals"
            });
        var approvals = [];
        for (var i = 0; i < req.user.approvals.length; i++) {
            // For some reason on some computers deepPopulate seems to make this a list, but on others an object
            if (req.user.approvals[i].owner.constructor == Array)
                req.user.approvals[i].owner = req.user.approvals[i].owner[0]
            approvals.push({
                _id: req.user.approvals[i]._id,
                owner: {
                    fname: req.user.approvals[i].owner.fname,
                    lname: req.user.approvals[i].owner.lname,
                    number: req.user.approvals[i].owner.number
                },
                questionSet: req.user.approvals[i].questionSet,
                school: req.user.approvals[i].school,
                submitter: req.user.approvals[i].submitter,
                status: req.user.approvals[i].status,
                answers: req.user.approvals[i].answers,
                history: req.user.approvals[i].history,
                comments: req.user.approvals[i].comments,
                sub_date: req.user.approvals[i].dates[0].toLocaleString('en-AU'),
                action_date: req.user.approvals[i].dates[req.user.approvals[i].dates.length - 1].toLocaleString('en-AU')
            });
        }
        res.json({
            success: true,
            approvals: approvals
        });
    });
}

module.exports.formHistory = (req, res, next) => {

    if (!req.user)
        return res.status(401).json({
            success: false,
            msg: "Forbidden"
        });
    else {
        historicalForms = [];
        for (let i = 0; i < req.body.length; i++) {
            Form.findOne({ _id: req.body }, (err, form) => {
                if (err) {
                    console.log('form error');
                    return res.status(400).json({ success: false, msg: "Something went wrong getting form history!" });
                }
                else {
                    QuestionSet.findOne({ _id: form.questionSet }, (err, qset) => {
                        if (err) {
                            console.log('qset error');
                            return res.status(400).json({ success: false, msg: "Something went wrong getting form history!" });
                        }
                        else {
                            historicalForms.push({
                                _id: form._id,
                                questionSet: qset,
                                school: form.school,
                                submitter: form.submitter,
                                status: form.status,
                                answers: form.answers,
                                history: form.history,
                                comments: form.comments,
                                sub_date: form.dates[0].toLocaleString('en-AU'),
                                action_date: form.dates[form.dates.length - 1].toLocaleString('en-AU')
                            });
                            if (i == req.body.length-1) {
                                return res.status(200).json({
                                    success: true,
                                    history: historicalForms
                                });
                            }
                        }
                    });
                }
            });
        }
    }

}  