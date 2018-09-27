var formModel = require('../models/forms');
var Form = formModel.Form;

var userModel = require('../models/users');
var User = userModel.User;

var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;

var mailer = require('./mailer');

/**
req.user._id

req.body.qset_id
req.body.answers
req.body.submitter
req.body.school

Assign status
**/
module.exports.addForm = (req, res, next) => {
    if (req.user && req.body.qset_id && req.body.answers && req.body.school) {
        QuestionSet.findById(req.body.qset_id, (err, set) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: err
                });
            }

            else if (!set) {
                return res.status(400).json({
                    success: false,
                    msg: "No matching question set found"
                });

            }
            else if (set.questionList.length != req.body.answers.length) {
                return res.status(400).json({
                    success: false,
                    msg: "Number of questions does not match number of answers"
                });
            }
            else {
                User.findById(req.user._id, (err, owner) => {

                    if (err) {
                        return res.status(400).json({
                            success: false,
                            msg: err
                        });

                    }
                    else if (!owner) {
                        return res.status(400).json({
                            success: false,
                            msg: "User not found"
                        });

                    }
                    else {
                        var form = new Form();

                        if (req.body.submitter == 'hos') {
                            form.status = 'awaiting-adr';
                        }
                        else {
                            form.status = 'awaiting-hos';
                        }
                        form.submitter = req.body.submitter;
                        form.owner = req.user._id;
                        form.questionSet = req.body.qset_id;
                        //fix format of answers
                        req.body.answers.forEach((o, i, a) => a[i] = { order: i, answer: a[i] });
                        form.answers = req.body.answers;
                        // form.dates = ['Sat Sep 15 2018 21:59:29 GMT+0800 (Australian Western Standard Time)'];
                        form.dates = [new Date()];

                        form.school = req.body.school;

                        form.save((err, form) => {
                            if (err) {
                                return res.status(400).json({
                                    success: false,
                                    msg: err
                                });
                            }
                            else {
                                owner.submissions.push(form._id);
                                owner.save((err, owner) => {
                                    if (err) {
                                        return res.status(400).json({
                                            success: false,
                                            msg: err
                                        });
                                    }
                                    else {
                                        // Send email to school HOS/ADR depending on stuff.
                                        if (req.school == 'ecm') {
                                            if (req.body.submitter == 'hos') {
                                                mailer.sendFormAccessEmail("You are the ADR, and have been sent this email for review\n", "neosh11@gmail.com", form._id);
                                            }
                                            else {
                                                mailer.sendFormAccessEmail("You are the HOS, and have been sent this email for review\n", "neosh11@gmail.com", form._id);
                                            }
                                        }
                                        else if (req.school == 'eng') {
                                            if (req.body.submitter == 'hos') {
                                                mailer.sendFormAccessEmail("You are the ADR, and have been sent this email for review\n", "neosh11@gmail.com", form._id);
                                            }
                                            else {
                                                mailer.sendFormAccessEmail("You are the HOS, and have been sent this email for review\n", "neosh11@gmail.com", form._id);
                                            }

                                        }
                                        else {
                                            if (req.body.submitter == 'hos') {
                                                mailer.sendFormAccessEmail("You are the ADR, and have been sent this email for review\n", "neosh11@gmail.com", form._id);
                                            }
                                            else {
                                                mailer.sendFormAccessEmail("You are the HOS, and have been sent this email for review\n", "neosh11@gmail.com", form._id);

                                            }
                                        }
                                        return res.status(201).json({
                                            success: true,
                                            msg: "New Form Submitted"
                                        });
                                    }
                                })
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        return res.status(400).json({
            success: false,
            msg: "Missing Data"
        });
    }
}

module.exports.listAll = (req, res, next) => {
    Form.find({}, '', (err, forms) => {
        if (!forms) {
            return res.status(403).json({
                success: false,
                msg: "Forbidden"
            });
        }
        else if (err) {
            return res.status(404).json({
                success: false,
                msg: "Forbidden"
            }); 
            console.log(err);
        }
        else {
            sendJsonResponse(res, 200, forms);
        }
    })
}

module.exports.formid = (req, res, next) => {
    Form.findById({ _id: req.params.id }).then(function (form) {
        res.send(form);
    })
}

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}
