var formModel = require('../models/forms');
var Form = formModel.Form;

var userModel = require('../models/users');
var User = userModel.User;

var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;

var emailModel = require('../models/emails');
var Email = emailModel.emailSchema;


var mailer = require('./mailer');

function sendFirstEmailToNextPerson(form) {
    // Send email to school HoS/AD(R) depending on stuff.
    if (form.submitter == 'HoS') {
        mailer.sendFormAccessEmail(form, "AD(R)");
    }
    else {
        mailer.sendFormAccessEmail(form, form.school + " HoS");
    }

}
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

            // Trim answers
            var answersCpy = [];
            if (req.body.answers) {
                req.body.answers.forEach((o, i) => {
                    if (req.body.answers[i]) {
                        //if object is an array
                        if (Object.prototype.toString.call(req.body.answers[i]) === "[object String]") {
                            req.body.answers[i] = req.body.answers[i].trim();
                        }
                    }
                    if (req.body.answers[i] == "" || !req.body.answers[i]) {
                        // ignore
                    }
                    else {
                        answersCpy.push(req.body.answers[i])
                    }
                })
            }
            req.body.answers = answersCpy;

            if (err) {
                return res.json({
                    success: false,
                    msg: err
                });
            }

            else if (!set) {
                return res.json({
                    success: false,
                    msg: "No matching question set found"
                });

            }
            else if (set.questionList.length != req.body.answers.length) {
                return res.json({
                    success: false,
                    msg: "Number of questions does not match number of answers"
                });
            }
            else {
                User.findById(req.user._id, (err, owner) => {

                    if (err) {
                        return res.json({
                            success: false,
                            msg: err
                        });

                    }
                    else if (!owner) {
                        return res.json({
                            success: false,
                            msg: "User not found"
                        });

                    }
                    else {
                        var form = new Form();

                        if (req.body.submitter == 'HoS') {
                            form.status = 'Awaiting AD(R)';
                        }
                        else {
                            form.status = 'Awaiting HoS';
                        }
                        form.submitter = req.body.submitter;
                        form.owner = req.user._id;
                        form.questionSet = req.body.qset_id;
                        //fix format of answers
                        req.body.answers.forEach((o, i, a) => a[i] = { order: i, answer: a[i] });
                        form.answers = req.body.answers;
                        // form.dates = ['Sat Sep 15 2018 21:59:29 GMT+0800 (Australian Western Standard Time)'];
                        form.dates = [new Date()];
                        form.comments = [];


                        form.school = req.body.school;

                        if (req.body.history) {
                            form.history = req.body.history;
                        }
                        else {
                            form.history = [];
                        }
                        
                        form.save((err, form) => {
                            if (err) {
                                return res.json({
                                    success: false,
                                    msg: err
                                });
                            }
                            else {
                                owner.submissions.push(form._id);
                                owner.save((err, owner) => {
                                    if (err) {
                                        return res.json({
                                            success: false,
                                            msg: err
                                        });
                                    }
                                    else {
                                        sendFirstEmailToNextPerson(form);
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
        return res.json({
            success: false,
            msg: "Missing Data"
        });
    }
}

//THIS CONTROLLER NEEDS TO UPDATE A FORM WITH CHANGE TO THE STATUS FIELD

// req.user._id
// req.body.parent_id
// req.body.answers

module.exports.resubmitForm = (req, res, next) => {

    // Clone parent form's stats
    // copy owner
    // questionSet
    // history - update history.
    // school
    // submitter

    Form.findById(req.body.parent_id, (err, form) => {

        // Trim answers
        var answersCpy = [];
        if (req.body.answers) {
            req.body.answers.forEach((o, i) => {
                if (req.body.answers[i]) {
                    //if object is an array
                    if (Object.prototype.toString.call(req.body.answers[i]) === "[object String]") {
                        req.body.answers[i] = req.body.answers[i].trim();
                    }
                }
                if (req.body.answers[i] == "" || !req.body.answers[i]) {
                    // ignore
                }
                else {
                    answersCpy.push(req.body.answers[i])
                }
            })
        }
        req.body.answers = answersCpy;

        if (err) {
            return res.status(400).json({ success: false, msg: 'No such parent form' });
        }
        else if (JSON.stringify(form.owner) != JSON.stringify(req.user._id)) {
            return res.status(400).json({ success: false, msg: 'Form not owned by user' });
        }
        else if (form.status != 'Provisionally Approved') {
            return res.status(400).json({ success: false, msg: 'Form is not provisionally approved' });
        }
        else if (form.answers.length != req.body.answers.length) {
            return res.status(400).json({ success: false, msg: 'Invalid no. of questions' });
        }

        //Valid form
        var new_form = new Form();
        // Clone parent form's stats
        // copy owner
        // questionSet
        // history - update history.
        // school
        // submitter
        new_form.owner = form.owner;
        new_form.questionSet = form.questionSet;
        // Deep clone history
        new_form.history = form.history;
        new_form.school = form.school;
        new_form.submitter = form.submitter
        new_form.dates = [new Date()];

        req.body.answers.forEach((o, i, a) => a[i] = { order: i, answer: a[i] });
        new_form.answers = req.body.answers;

        form.status = 'Resubmitted';

        //Add Parent Id to history
        new_form.history.push(form._id);

        //Set statuses
        if (req.body.submitter == 'HoS') {
            new_form.status = 'Awaiting AD(R)';
        }
        else {
            new_form.status = 'Awaiting HoS';
        }
        

        new_form.save((err, new_form) => {
            if (err) {
                return res.status(400).json({ success: false, msg: 'Something went wrong while saving form' });
            }
            else {
                // Update user
                User.findById(req.user._id, (err, user) => {
                    if (err) {
                        return res.status(400).json({ success: false, msg: 'Something went wrong getting user' });
                    }
                    else if (!user) {
                        return res.status(400).json({ success: false, msg: 'No such user found in database' });
                    }
                    //Remove from array TOTO Check
                    // WE DON'T WANT TO REMOVE FORM FROM SUBMISSIONS ELSE I WON'T BE ABLE TO RENDER HISTORY
                    //user.submissions = user.submissions.filter(item => item !== form._id);
                    user.submissions.push(new_form.id);

                    user.save((err, user) => {
                        if (err) {
                            return res.status(400).json({ success: false, msg: 'Could not update user array' });
                        }
                        else {
                            //Send email
                            sendFirstEmailToNextPerson(new_form);
                            form.save((err, form) => {
                                if (err) {
                                    return res.status(400).json({ success: false, msg: 'Something went wrong updating parent' });
                                }
                                else {
                                    return res.status(200).json({ success: true, msg: 'Form resubmitted!' });
                                }
                            });
                        }
                    })
                })
            }
        });
    });
}

// THIS CONTROLLER WILL RECIEVE AN OBJECT WITH comments AND response.
// IF response = 'approve' THEN A DATE NEEDS TO BE PUSHED ONTO THE DATES ARRAY 
//      AND THE STATUS NEEDS TO BE SET TO THE NEXT APPROVER
// ELSE IF response = 'provisional approve' THEN THE STATUS NEEDS TO BE SET TO 'provision'
// ELSE IF response = 'rejected' THEN CHANGE STATUS TO 'rejected'

// Comments neccessary for rejection and provisional approve

//req.body.response - Approved, Provisonally Approved, Rejected
//req.body.comments - An array of comments
//req.body.acting - Boolean describing of approver was acting
//req.body.form_id - ID of form being responded to

//req.user._id

module.exports.formResponse = (req, res, next) => {

    if (!(req.user && req.body.form_id && req.body.response)) {
        return res.status(400).json({ success: false, msg: 'Not logged in or No response or No associated form!' });

    }

    Form.findById(req.body.form_id, (err, form) => {
        if (err) {
            return res.status(400).json({ success: false, msg: 'Something went wrong' });
        }
        if (!form) {
            return res.status(400).json({ success: false, msg: 'No such form' });
        }

        if (JSON.stringify(req.user._id) != JSON.stringify(form.allocatedStaff)) {
            return res.status(400).json({ success: false, msg: 'Bad user' });
        }
        else {

            var actingString = '';
            if (req.body.acting) {
                actingString = 'Acting ';
            }

            var backupForm = {
                _id: form._id,
                dates: form.dates.slice(0),
                status: form.status,
                allocatedStaff: form.allocatedStaff,
                approvedBy: form.approvedBy.slice(0),
            }
            //Trim/remove comments
            commentCopy = [];
            if (req.body.comments) {
                req.body.comments.forEach((o, i) => {
                    if (req.body.comments[i].text) {
                        req.body.comments[i].text = req.body.comments[i].text.trim();
                    }
                    if (req.body.comments[i].text == "" || !req.body.comments[i]) {
                        // ignore
                    }
                    else {
                        commentCopy.push(req.body.comments[i]);
                    }
                })
            }
            req.body.comments = commentCopy;

            if (req.body.response == 'Approved') {
                var role;

                if (!req.body.comments) {
                    return res.status(400).json({ success: false, msg: "Missing comments array" });
                }
                else if (req.body.comments.length != 0) {
                    return res.status(400).json({ success: false, msg: "Sorry you can't Approve with comments, please select Provisionally Approve or remove comments" });
                }
                else {


                    if (form.status == 'Awaiting HoS') {
                        if (form.submitter == 'AD(R)') {
                            form.status = 'Awaiting PVC-ED';
                            var approver = form.allocatedStaff;
                            form.approvedBy.push({ role: actingString + 'HoS', id: approver });
                            form.allocatedStaff = null;
                            form.dates.push(new Date());

                            role = 'PVC-ED';
                        }
                        else {
                            form.status = 'Awaiting AD(R)';

                            var approver = form.allocatedStaff;
                            form.approvedBy.push({ role: actingString + 'HoS', id: approver });
                            form.allocatedStaff = null;
                            form.dates.push(new Date());

                            role = 'AD(R)';
                        }
                    }
                    else if (form.status == 'Awaiting AD(R)') {
                        form.status = 'Awaiting PVC-ED';

                        var approver = form.allocatedStaff;
                        form.approvedBy.push({ role: actingString + 'AD(R)', id: approver });
                        form.allocatedStaff = null;
                        form.dates.push(new Date());


                        role = 'PVC-ED';

                    }
                    else if (form.status == 'Awaiting PVC-ED') {
                        form.status = 'Fully Approved';

                        var approver = form.allocatedStaff;
                        form.approvedBy.push({ role: actingString + 'PVC-ED', id: approver });
                        form.allocatedStaff = null;
                        form.dates.push(new Date());


                        role = 'final';
                    }
                    else {
                        return res.status(400).json({ success: false, msg: 'Form has bad status' });
                    }

                    form.save((err, form) => {
                        if (err) {
                            return res.status(400).json({ success: false, msg: 'Something went wrong saving the form' });
                        }
                        //send an email to who??
                        if (form.status == 'Fully Approved') {

                            // return res.status(200).json({ success: true, msg: 'Form approved but no PDF email sent' });
                            mailer.sendPDFAccessEmail(form, res, 'Approved and email sent', backupForm);
                        }
                        else {
                            //email person
                            mailer.sendFormAccessEmail(form, role, res, 'Approved and email sent', backupForm);
                        }
                    });
                }
            }
            else if (req.body.response == 'Provisionally Approved') {

                if (!req.body.comments) {
                    return res.status(400).json({ success: false, msg: 'No comments' });
                }
                else if (req.body.comments.length != 0) {

                    if (form.status == 'Awaiting HoS') {
                        form.rejectionRole = actingString + 'HoS';
                    }
                    else if (form.status == 'Awaiting AD(R)') {
                        form.rejectionRole = actingString + 'AD(R)';
                    }
                    else if (form.status == 'Awaiting PVC-ED') {
                        form.rejectionRole = actingString + 'PVC-ED';
                    }
                    else {
                        //Something is broken
                        return res.status(400).json({ success: false, msg: 'Bad form status' });
                    }

                    form.status = 'Provisionally Approved';


                    req.body.comments.forEach((o, i) => req.body.comments[i].commenter = form.allocatedStaff)
                    form.comments = req.body.comments;

                    form.dates.push(new Date());
                    form.allocatedStaff = null;

                    form.save((err, form) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({ success: false, msg: 'Something went wrong saving the form' });
                        }
                        else {
                            //No need to bother with confirming delete, low priority 
                            User.findById(backupForm.allocatedStaff, (err, staff) => {
                                //delete
                                if (err) console.log(err);
                                staff.approvals = staff.approvals.filter(item => JSON.stringify(item) != JSON.stringify(backupForm._id));
                                staff.save((err, staff) => { if (err) console.log(err); });
                            })
                            //email owner of form about provisional approval approval 
                            User.findById(form.owner, (err, usr) => {
                                //Shouldn't be errors
                                mailer.sendEmail(usr.number + "@student.uwa.edu.au", "One of your forms has been provisionally approved", "A form you sent has been provisionally approved, please view it on http://localhost:4200");
                            });

                            return res.status(200).json({ success: true, msg: 'Provisionally Approved and email sent to owner' });
                        }
                    });
                }
                else {
                    return res.status(400).json({ success: false, msg: 'No comments' });
                }
            }
            else if (req.body.response == 'Rejected') {

                if (!req.body.comments) {
                    return res.status(400).json({ success: false, msg: 'No comments' });
                }
                if (req.body.comments.length != 0) {

                    if (form.status == 'Awaiting HoS') {
                        form.rejectionRole = actingString + 'HoS';
                    }
                    else if (form.status == 'Awaiting AD(R)') {
                        form.rejectionRole = actingString + 'AD(R)';
                    }
                    else if (form.status == 'Awaiting PVC-ED') {
                        form.rejectionRole = actingString + 'PVD-ED';
                    }
                    else {
                        //Something is broken
                        return res.status(400).json({ success: false, msg: 'Bad form status' });
                    }
                    form.status = 'Rejected'

                    req.body.comments.forEach((o, i) => req.body.comments[i].commenter = form.allocatedStaff)
                    form.comments = req.body.comments;

                    form.dates.push(new Date());
                    form.allocatedStaff = null;

                    form.save((err, form) => {
                        if (err) {
                            return res.status(400).json({ success: false, msg: 'Something went wrong saving the form' });
                        }
                        else {

                            //No need to bother with confirming delete, low priority 
                            User.findById(backupForm.allocatedStaff, (err, staff) => {
                                //delete
                                staff.approvals = staff.approvals.filter(item => JSON.stringify(item) != JSON.stringify(backupForm._id));
                                staff.save((err, staff) => { });
                            })


                            //email owner of form about provisional approval approval 
                            User.findById(form.owner, (err, usr) => {
                                //Shouldn't be errors
                                mailer.sendEmail(usr.number + "@student.uwa.edu.au", "One of your forms has been rejected", "A form you submitted has been rejected, to check comments, view: http://localhost:4200/");
                            });
                            return res.status(200).json({ success: true, msg: 'Rejected and email sent to owner' });
                        }
                    });

                }
                else {
                    return res.status(400).json({ success: false, msg: 'No comments' });
                }
            }
            else {
                return res.status(400).json({ success: false, msg: 'Bad Form Status' });
            }
        }


    });
}

module.exports.listAll = (req, res, next) => {
    Form.find({}, '', (err, forms) => {
        if (!forms) {
            return res.status(400).json({
                success: false,
                msg: "Forbidden"
            });
        }
        else if (err) {
            console.log(err);
            return res.status(404).json({
                success: false,
                msg: "Forbidden"
            });
            
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
