var User = require('../models/users').User;

var Form = require('../models/forms').Form;

module.exports.listAll = (req, res, next) => {
  if (req.user == undefined || !req.user.isIT) {
    var stat = req.user == undefined ? 401 : 403
    return sendJsonResponse(res, stat, {
      success: false,
      msg: "Forbidden"
    });
  }
  User.find({}, '', (err, users) => {
    if (err)
      return res.json({
	success: false,
        error: err
      });

    return res.json(users);
  });
}

//Updates user information in database
module.exports.updateUser = (req, res, next) => {
  if (req.user == undefined || !req.user.isIT) {
    stat = req.user == undefined ? 401 : 403
    return sendJsonResponse(res, stat, {
      success: false,
      msg: "Forbidden"
    });
  }

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
  if (req.user == undefined || !req.user.isIT) {
    stat = req.user == undefined ? 401 : 403
    return sendJsonResponse(res, stat, {
      success: false,
      msg: "Forbidden"
    });
  }
  
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
          if (!usr.approvals.includes(formID)) {
            usr.approvals.push(formID);
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
