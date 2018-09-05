var userModel = require('../models/users');
var User = userModel.userSchema;

var formModel = require('../models/forms');
var Form = formModel.formSchema;

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

// Return whether successful or failure
module.exports.addFormToUser=(userID, formID)=>{
  if(!userID || ! formID){
    console.log(`missing userID or formID`);
    return;
  }
  User.findById(userID, (err, usr)=>{
    if(err){
      console.log(err);
    }
    else if(!usr){
      console.log("no user found");
    }
    else{
      //Check if form exists

      Form.findById(formID, (err, form)=>{

        if(err){
          console.log(err);
        }
        else if(!form){
          console.log('no such form');
        }
        else{

          //Check if form need to be updated

          if(form.allocatedStaff != userID){
            form.allocatedStaff = userID;
            form.save((err, form)=>{
              if(err){
                console.log(err)
              }
            });
          }

          // Update User to include form if needed
          if(!usr.forms.includes(formID)){
            usr.forms.push(formID);
            usr.save((err, usr)=>{
              if(err){
                console.log(err)
              }
          });
          }
        }
      })


    }
  })
}

//*****************************************
var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}
