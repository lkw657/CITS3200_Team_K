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

//Form API
/* Requires:
owner
questionSet (ref)
*/
router.post('/form', ctrlForm.addForm);
router.get('/form', ctrlForm.listAll);

//Question Set API
/* Requires:
questionList
*/
router.post('/questionSet', ctrlQuestionSet.addQuestionSet);
router.get('/questionSet', ctrlQuestionSet.listAll);
router.get('/questionSet/latest', ctrlQuestionSet.latestQuestionSet);
router.get('/questionSet/:id', ctrlQuestionSet.questionSetId);


module.exports = router
