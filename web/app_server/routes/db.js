var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/users.js')


/* GET users listing. */
router.get('/user', ctrlUsers.respond);

// User routes
router.post('/user/create', ctrlUsers.addUser);
router.get('/user/list', ctrlUsers.listAll);

router.get('/user/:userid', function(req, res, next) {
    res.status('200');
    res.json({'username': 'lala'});
});

//BELOW ARE DAVE'S NEEDS, CAN BE CHANGED TO WHATEVER SEMANTICS YOU NEED

//User Register Route placeholder
//This will receive an object containining the below - 
// role: req.body.role,
// email: req.body.email,
// username: req.body.username,
// password: req.body.password

//The controller needs to ensure the username and email are not already in db then add to db if all good then return as below 

router.post('/register', function (req, res, next) {

  //If all ok
  res.json({ success: true, msg: 'User Registered' });

  //If failed
  res.json({ success: false, msg: 'Failed to Register User' });
});

//User Authenticate Route
//This will receive an object containining the below - 
// username: req.body.username,
// password: req.body.password

//Controller will need to make sure username in db then compare password then return as below

router.post('/authenticate', function (req, res, next) {

  //If successful
  res.json({
    success: true,
    msg: 'You are successfully logged in',
    //token: `JWT ${token}` , This is what I used in my project, any token would do I guess? 
    user: {
      username: user.username
    }
  });

  //If username not in db
  return res.json({ success: false, msg: 'User not found' });

  //If password wrong
  return res.json({ success: false, msg: 'Password incorrect' });
});

module.exports = router;
