var formModel = require('../models/forms');
var Form = formModel.formSchema;

var userModel = require('../models/users');
var User = userModel.userSchema;

/**
req.body.owner
req.body.questionSet

Assign status
**/
module.exports.addForm = (req, res, next)=>{
    if(req.body.owner && req.body.questionSet)
    {
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
                form.status='created';
            
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

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}
