var User = require('../models/users').User;

var Form = require('../models/forms').Form;

module.exports.listAll = (req, res, next) => {
  // if (req.user == undefined || req.user.isIT)
  //   return sendJsonResponse(res, 403, {
  //       msg: "forbidden"
  //   });
  User.find({}, '', (err, users) => {
    if (!users) {
      sendJsonResponse(res, 403, {
        error: "forbidden"
      });
    }
    else if (err) {
      sendJsonResponse(res, 400, {
        error: err
      });
    }

    else {
      sendJsonResponse(res, 200, users);
    }
  });
}

//Updates user information in database
module.exports.updateUser = (req, res, next) => {

  User.findById(req.body._id, function (err, user) {
    if (err) {
      return res.json({ success: false, msg: 'Could not find user' });
    };

    user.fname = req.body.fname;
    user.lname = req.body.lname;
    user.number = req.body.number;
    user.isIT = req.body.isIT;

    user.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Could not update user' });
      }
      return res.json({ success: true, msg: 'User Updated' });
    });
  });
}

//Delete User from database
module.exports.removeUser = (req, res, next) => {
  User.findById(req.body._id, function (err, user) {

    if (err) {
      return res.json({ success: false, msg: 'Could not find user' });
    };

    user.remove(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Could not delete user' });
      }
      else {
        return res.json({ success: true, msg: 'User has been removed!' });
      }

    });
  });
}

// Return whether successful or failure
module.exports.addFormToUser = (userID, formID) => {
  if (!userID || !formID) {
    console.log(`missing userID or formID`);
    return;
  }
  User.findById(userID, (err, usr) => {
    if (err) {
      console.log(err);
    }
    else if (!usr) {
      console.log("no user found");
    }
    else {
      //Check if form exists

      Form.findById(formID, (err, form) => {

        if (err) {
          console.log(err);
        }
        else if (!form) {
          console.log('no such form');
        }
        else {

          //Check if form need to be updated

          if (form.allocatedStaff != userID) {
            form.allocatedStaff = userID;
            form.save((err, form) => {
              if (err) {
                console.log(err)
              }
            });
          }

          // Update User to include form if needed
          if (!usr.forms.includes(formID)) {
            usr.forms.push(formID);
            usr.save((err, usr) => {
              if (err) {
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
