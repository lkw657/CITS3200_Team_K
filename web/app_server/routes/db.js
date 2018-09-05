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


module.exports = router;
