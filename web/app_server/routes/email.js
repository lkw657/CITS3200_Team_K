var express = require('express');
var ctrlEmail = require('../controllers/emails')
var router = express.Router();

/*Debugging purposes*/
router.get('/list', ctrlEmail.listAllEmails);


router.post('/add', ctrlEmail.addEmail);


module.exports = router;