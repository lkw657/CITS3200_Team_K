var formModel = require('../models/forms');
var Form = formModel.Form;

var userModel = require('../models/users');
var User = userModel.User;

var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;

var mailer = require('./mailer');

function sendFirstEmailToNextPerson(school, submitter, form_id, ){
    // Send email to school HOS/ADR depending on stuff.
    if (school == 'ecm') {
        if (submitter == 'hos') {
            mailer.sendFormAccessEmail("You are the ADR, and have been sent this email for review\n", "neosh11@gmail.com", form_id);
        }
        else {
            mailer.sendFormAccessEmail("You are the HOS, and have been sent this email for review\n", "neosh11@gmail.com", form_id);
        }
    }
    else if (school == 'eng') {
        if (submitter == 'hos') {
            mailer.sendFormAccessEmail("You are the ADR, and have been sent this email for review\n", "neosh11@gmail.com", form_id);
        }
        else {
            mailer.sendFormAccessEmail("You are the HOS, and have been sent this email for review\n", "neosh11@gmail.com", form_id);
        }

    }
    else {
        if (submitter == 'hos') {
            mailer.sendFormAccessEmail("You are the ADR, and have been sent this email for review\n", "neosh11@gmail.com", form_id);
        }
        else {
            mailer.sendFormAccessEmail("You are the HOS, and have been sent this email for review\n", "neosh11@gmail.com", form_id);

        }
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
                        
                        if(req.body.history){
                            form.history = req.body.history;
                        }

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
                                        sendFirstEmailToNextPerson(req.body.school, req.body.submitter, form._id);
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

//THIS CONTROLLER NEEDS TO UPDATE A FORM WITH CHANGE TO THE STATUS FIELD

// req.user._id
// req.body.parent_id
// req.body.answers

module.exports.updateForm = (req, res, next) => {

    // Clone parent form's stats
    // copy owner
    // questionSet
    // history - update history.
    // scholl
    // submitter

    Form.findById(req.body.parent_id, (err, form) => {
        if(err){
            return res.status(403).json({ success: false, msg: 'No such parent form' });   
        }
        else if(req.user._id != form.owner){
            return res.status(403).json({ success: false, msg: 'Form not owned by user' });
        }
        else if(form.status != 'provision'){
            return res.status(403).json({ success: false, msg: 'Form is not provisionally approved' });
        }
        else if(form.answers.length != req.body.answers.length){
            return res.status(403).json({ success: false, msg: 'Invalid no. of questions' });            
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
        new_form.answers = req.body.answers;
        
        form.status = 'provision-old';
        form.save((err, form) => {
            if(err){
                return res.status(403).json({ success: false, msg: 'Something went wrong updating parent' });
            }
            new_form.history.push(form._id);

            //Set statuses
            if (req.body.submitter == 'hos') {
                form.status = 'awaiting-adr';
            }
            else {
                form.status = 'awaiting-hos';
            }

            new_form.save((err, new_form)=>{
                if(err){
                    return res.status(403).json({ success: false, msg: 'Something went wrong while saving form' });
                }
                else{
                    // Update user
                    User.findById(req.user._id, (err, user)=>{
                        if(err){
                            return res.status(403).json({ success: false, msg: 'Something went wrong getting user' });
                        }
                        else if(!user){
                            return res.status(403).json({ success: false, msg: 'No such user found in DB' });
                        }
                        //Remove from array TOTO Check

                        user.submissions = user.submissions.filter(item => item !== form._id);
                        user.submissions.push(new_form.id);

                        user.save((err, user)=>{
                            if(err){
                                return res.status(403).json({ success: false, msg: 'Could not update user array' });
                            }
                            else{
                                //Send email
                                sendFirstEmailToNextPerson(new_form.school, new_form.submitter, new_form._id);
                                return res.status(200).json({ success: true, msg: 'Form added to user and email sent' });
                            }
                        })
                    })

                }
            });


        });


    });

    return res.json({ success: true, msg: 'Form resubmitted!' });
}

// THIS CONTROLLER WILL RECIEVE AN OBJECT WITH comments AND response.
// IF response = 'approve' THEN A DATE NEEDS TO BE PUSHED ONTO THE DATES ARRAY 
//      AND THE STATUS NEEDS TO BE SET TO THE NEXT APPROVER
// ELSE IF response = 'provisional approve' THEN THE STATUS NEEDS TO BE SET TO 'provision'
// ELSE IF response = 'rejected' THEN CHANGE STATUS TO 'rejected'

// Comments neccessary for rejection and provisional approve

//req.body.response
//req.body.comments
//req.body.acting
//req.body.form_id

//req.user._id

module.exports.formResponse = (req, res, next) => {

    if (!(req.user && req.body.form_id && req.body.response))
    {
        return res.status(403).json({ success: false, msg: 'Not logged in or No response or No associated form!' });
        
    }
    
    Form.findById(req.body.form_id, (err, form) => {
        if(err){
            return res.status(403).json({ success: false, msg: 'Something went wrong' });
            
        }
        if(!form){
            return res.status(403).json({ success: false, msg: 'No such form' });
        }
        if(req.user._id != form.allocatedStaff ){
            return res.status(403).json({ success: false, msg: 'Bad user' });
        }

        var actingString='';
        if(req.body.acting){
            actingString = 'acting-';
        }

        if(req.body.response == 'approve'){
            var email, emailContent;
            if(form.status == 'awaiting-hos'){
                if(form.submitter == 'adr'){
                    form.status = 'awaiting-pvc-ed';
                    var approver = form.allocatedStaff;
                    form.approvedBy.push({role: actingString+'hos', id: approver});
                    form.allocatedStaff = null;
                    form.dates.push(new Date());
                    
                    email = 'neosh11@gmail.com';
                    emailContent = 'You are pvc ahha';
                }
                else{
                    form.status = 'awaiting-adr';

                    var approver = form.allocatedStaff;
                    form.approvedBy.push({role: actingString+'hos', id: approver});
                    form.allocatedStaff = null;
                    form.dates.push(new Date());

                    email = 'neosh11@gmail.com';
                    emailContent = 'You are adr ahha';
                }
            }
            else if(form.status == 'awaiting-adr'){
                form.status = 'awaiting-pvc-ed';

                var approver = form.allocatedStaff;
                form.approvedBy.push({role: actingString+'adr', id: approver});
                form.allocatedStaff = null;
                form.dates.push(new Date());


                email = 'neosh11@gmail.com';
                emailContent = 'awaiting-pvc-ed';

            }
            else if(form.status == 'awaiting-pvc-ed'){
                form.status = 'email-final';

                var approver = form.allocatedStaff;
                form.approvedBy.push({role: actingString+'pvc-ed', id: approver});
                form.allocatedStaff = null;
                form.dates.push(new Date());


                email = 'neosh11@gmail.com';
                emailContent = 'Click this dodgy link hehe for pdf';
            }
            else{
                return res.status(403).json({ success: false, msg: 'Form has bad status' });
            }

            form.save((err, form) => {
                if (err) {
                    return res.status(403).json({ success: false, msg: 'Something went wrong saving the form' });
                }
                //send an email to who??
                if(form.status == 'email-final'){
                    //TODO EMAILS
                }
                else{
                    //email person
                    mailer.sendFormAccessEmail(emailContent+"\n", email, form._id);
                    return res.status(200).json({ success: true, msg: 'Approved and email sent' });       
                }
            });
        }
        else if(req.body.response =='provisional approve'){
            
            form.status = 'provision';
            
            if(form.status == 'awaiting-hos'){
                form.rejectionRole = actingString+'hos';
            }
            else if(form.status == 'awaiting-adr'){
                form.rejectionRole = actingString+'adr';
            }
            else if(form.status == 'awaiting-pvc-ed'){
                form.rejectionRole = actingString+'pvc-ed';
            }
            else{
                //Something is broken
                return res.status(403).json({ success: false, msg: 'Bad form status' });

            }

            if(req.body.comments){
                // TODO ask david
                form.comments = req.body.comments;
                form.dates.push(new Date());
                allocatedStaff = null;

                form.save((err, form) => {
                    if (err) {
                        return res.status(403).json({ success: false, msg: 'Something went wrong saving the form' });
                    }
                    else{
                        //email owner of form about provisional approval approval 
                        mailer.sendEmail(req.user.number + "@uwa.edu.au", "Provisional Approval fo one of your forms", "Your email was provisionally approvede bro!");
                        return res.status(200).json({ success: true, msg: 'Provisionally Approved and email sent to owner' });
                    }
                });
            }
            else{
                return res.status(403).json({ success: false, msg: 'No comments' });
            }
        }
        else if(req.body.response == 'rejected'){

            if(form.status == 'awaiting-hos'){
                form.rejectionRole = actingString+'hos';
            }
            else if(form.status == 'awaiting-adr'){
                form.rejectionRole = actingString+'adr';
            }
            else if(form.status == 'awaiting-pvc-ed'){
                form.rejectionRole = actingString+'pvc-ed';
            }
            else{
                //Something is broken
                return res.status(403).json({ success: false, msg: 'Bad form status' });

            }

            if(req.body.comments){
                form.status = 'rejected'
                form.comments = req.body.comments;
                form.dates.push(new Date());
                allocatedStaff = null;

                form.save((err, form) => {
                    if (err) {
                        return res.status(403).json({ success: false, msg: 'Something went wrong saving the form' });
                    }
                    else{
                        //email owner of form about provisional approval approval 
                        mailer.sendEmail(req.user.number + "@uwa.edu.au", "Provisional Approval fo one of your forms", "Your email was provisionally approvede bro!");
                        return res.status(200).json({ success: true, msg: 'Provisionally Approved and email sent to owner' });
                    }
                });

            }
            else{
                return res.status(403).json({ success: false, msg: 'No comments' });
            }
        }
        else{
            return res.status(403).json({ success: false, msg: 'Bad Form Status' });
        }


    });
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
