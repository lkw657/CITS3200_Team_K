var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/users.js');
var ctrlForm = require('../controllers/forms.js');
var ctrlQuestionSet = require('../controllers/forms.js');



/* GET users listing. */
router.get('/user', ctrlUsers.respond);

// User API
router.post('/user/create', ctrlUsers.addUser);
router.get('/user/list', ctrlUsers.listAll);

//Form API
router.post('/form/create', ctrlForm.addForm);
router.get('/form/list', ctrlForm.listAll);

//Question Set API
router.post('/questionSet/create', ctrlQuestionSet.addQuestionSet);
router.get('/questionSet/list', ctrlQuestionSet.listAll);



module.exports = router;
