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

// Adding a user is register in index.js
router.get('/users', ctrlUsers.listAll);
router.put('/updateUser', ctrlUsers.updateUser);
router.put('/removeUser', ctrlUsers.removeUser);

//Form API
/* Requires:
owner
questionSet (ref)
*/
router.post('/newSubmission', ctrlForm.addForm);
router.post('/resubmit', ctrlForm.resubmitForm);
router.post('/formResponse', ctrlForm.formResponse);
router.get('/form', ctrlForm.listAll);
router.get('/form/:id', ctrlForm.formid);

//Question Set API
/* Requires:
questionList
*/
router.post('/questionSet', ctrlQuestionSet.addQuestionSet);
router.get('/questionSet', ctrlQuestionSet.listAll);
router.get('/questionSet/latest', ctrlQuestionSet.latestQuestionSet);
router.get('/questionSet/:id', ctrlQuestionSet.questionSetId);


module.exports = router
