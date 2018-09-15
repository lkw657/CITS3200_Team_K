var formModel = require('../models/forms');
var Form = formModel.formSchema;

var userModel = require('../models/users');
var User = userModel.userSchema;

var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;

/**
req.body.owner
req.body.questionSet
req.body.answers
Assign status
**/
module.exports.addForm = (req, res, next)=>{
    if(req.body.owner && req.body.questionSet && req.body.answers)
    {
        QuestionSet.findById(req.body.questionSet, (err, set)=>{
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
                User.findById(req.body.owner, (err, owner)=>{

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

                        form.owner=req.body.owner;
                        form.questionSet=req.body.questionSet;
                        form.answers=req.body.answers;
						form.dates = ['Sat Sep 15 2018 21:59:29 GMT+0800 (Australian Western Standard Time)'];
						//form.dates = [new Date()];
                        form.status='created';
						form.school= req.body.school;

                        form.save((err,form)=>{
                            if(err){
                                sendJsonResponse(res, 400, {
                                    error: err
                                });
                            }
                            else{
                                owner.forms.push(form._id);
                                owner.save((err, owner)=>{
                                    if(err){
                                        sendJsonResponse(res, 400, {
                                            error: err
                                        });
                                    }
                                    else{
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
