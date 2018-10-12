var express = require('express');
var ctrlEmail = require('../controllers/emails')
var router = express.Router();

router.get('/list', ctrlEmail.listAllEmails);
router.put('/updateEmail', ctrlEmail.updateEmail);
router.post('/addEmail', ctrlEmail.addEmail);
router.put('/removeEmail', ctrlEmail.removeEmail);


module.exports = router;