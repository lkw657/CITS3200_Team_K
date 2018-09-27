var formModel = require('../models/forms');
var Form = formModel.Form;

var userModel = require('../models/users');
var User = userModel.User;

var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;

var mailer = require('./mailer');

/**
req.user._id

req.body.questionSet
req.body.answers
req.body.submitter
req.body.school

Assign status
**/
module.exports.addForm = (req, res, next)=>{
    console.log(req.user);
    console.log(req.body.questionSet);
    if(req.user && req.body.questionSet && req.body.answers && req.body.school)
    {
        QuestionSet.findById(req.body.questionSet, (err, set)=>{
            console.log("SET");
            console.log(set);
            if(err){
                sendJsonResponse(res, 400, {
                    error: err
                });
            }
            
            else if(!set){
                
                sendJsonResponse(res, 400, {
                    error: "question set not found"
                });
            }
            else if(set.questionList.length != req.body.answers.length){
                sendJsonResponse(res, 400, {
                    error: "num of answers doesn't match num of questions"
                });
            }
            else{
                User.findById(req.user._id, (err, owner)=>{

                    if(err){
                        sendJsonResponse(res, 400, {
                            error: err
                        });
                    }
                    else if(!owner){
                        sendJsonResponse(res, 400, {
                            error: "user not found"
                        });
                    }
                    else{
                        var form = new Form();

                        if(req.body.submitter == 'hos'){
                            form.status='awaiting-adr';
                        }
                        else{
                            form.status='awaiting-hos';
                        }
                        form.submitter = req.body.submitter;
                        form.owner= req.user._id;
                        form.questionSet=req.body.questionSet;
                        form.answers=req.body.answers;
						// fo   rm.dates = ['Sat Sep 15 2018 21:59:29 GMT+0800 (Australian Western Standard Time)'];
						form.dates = [new Date()];
                        
						form.school= req.body.school;

                        form.save((err,form)=>{
                            if(err){
                                sendJsonResponse(res, 400, {
                                    error: err
                                });
                            }
                            else{
                                owner.submissions.push(form._id);
                                owner.save((err, owner)=>{
                                    if(err){
                                        sendJsonResponse(res, 400, {
                                            error: err
                                        });
                                    }
                                    else{
                                        // Send email to school HOS/ADR depending on stuff.
                                        if(req.school == 'ecm'){
                                            if(req.body.submitter=='hos'){
                                                mailer.sendFormAccessEmail("You are the ADR, and have been sent this email for review\n","neosh11@gmail.com",form._id);
                                            }
                                            else{
                                                mailer.sendFormAccessEmail("You are the HOS, and have been sent this email for review\n","neosh11@gmail.com",form._id);    
                                            }    
                                        }
                                        else if(req.school == 'eng'){
                                            if(req.body.submitter=='hos'){
                                                mailer.sendFormAccessEmail("You are the ADR, and have been sent this email for review\n","neosh11@gmail.com",form._id);
                                            }
                                            else{
                                                mailer.sendFormAccessEmail("You are the HOS, and have been sent this email for review\n","neosh11@gmail.com",form._id);
                                            }
    
                                        }
                                        else{
                                            if(req.body.submitter=='hos'){
                                                mailer.sendFormAccessEmail("You are the ADR, and have been sent this email for review\n","neosh11@gmail.com",form._id);                                                
                                            }
                                            else{
                                                mailer.sendFormAccessEmail("You are the HOS, and have been sent this email for review\n","neosh11@gmail.com",form._id);
                                                
                                            }
    
                                        }

                                        sendJsonResponse(res, 201, form);
                                    }
                                })
                            }
                        });
                    }
                });
            }
        });


    }
    else
    {
        sendJsonResponse(res, 400, {
            error: "missing data"
        });
    }
}

module.exports.listAll = (req, res, next) => {
    Form.find({}, '', (err, forms) => {
        if (!forms) {
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
            sendJsonResponse(res, 200, forms);
        }
    })
}

module.exports.formid = (req, res, next) => {
    Form.findById({_id:req.params.id}).then(function(form){
            res.send(form);
        })
}

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}
