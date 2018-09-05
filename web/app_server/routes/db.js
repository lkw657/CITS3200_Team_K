var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/users.js');
var ctrlForm = require('../controllers/forms.js');
var ctrlQuestionSet = require('../controllers/questionSets.js');


// User API
/* Requires:
role
name
email
number
password
*/

router.post('/user/create', ctrlUsers.addUser);
router.get('/user/list', ctrlUsers.listAll);

//Form API
/* Requires:
owner
questionSet (ref)
*/
router.post('/form/create', ctrlForm.addForm);
router.get('/form/list', ctrlForm.listAll);

//Question Set API
/* Requires:
questionList
*/
router.post('/questionSet/create', ctrlQuestionSet.addQuestionSet);
router.get('/questionSet/list', ctrlQuestionSet.listAll);


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
