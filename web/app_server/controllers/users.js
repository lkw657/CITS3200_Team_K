
module.exports.respond = function(req, res, next) {
  res.send('respond with a resource');
}

var userModel = require('../models/users');
var User = userModel.userSchema;

/**
req.body.role
req.body.name
req.body.email
req.body.number
req.body.password

**/
module.exports.addUser = (req, res, next)=>{
  if(req.body.role && req.body.name && req.body.email && req.body.number && req.body.password)
  {
    var usr = new User();

    usr.role=req.body.role
    usr.name=req.body.name
    usr.email=req.body.email
    usr.number=req.body.number
    usr.password=req.body.password

    usr.save((err,usr)=>{
      if(err){
        sendJsonResponse(res, 400, {
            error: err
        });
      }
      else{
        sendJsonResponse(res, 201, usr);
      }
    })
  }
  else
  {
    sendJsonResponse(res, 400, {
        error: "missing data"
    });
  }
}

module.exports.listAll = (req, res, next)=>{
  User.find({}, '', (err, users) => {
    if (!users) {
      sendJsonResponse(res, 403, {
          error: "forbidden"
      });
    }
    else if(err){
      sendJsonResponse(res, 400, {
          error: err
      });
    }

    else{
      sendJsonResponse(res, 200, users);
    }
  });
}

//*****************************************
var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}
