var express = require('express');
var ctrlMail = require('../controllers/mailer')
var router = express.Router();

/* */
router.post('/verifyFormAccess', ctrlMail.verifyFormAccess);

/*Debugging purposes*/
router.get('/list', ctrlMail.listAllMail);

module.exports = router;
