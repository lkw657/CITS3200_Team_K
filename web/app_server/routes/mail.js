var express = require('express');
var ctrlMail = require('../controllers/mailer')
var router = express.Router();

/* */
router.post('/verifyFormAccess', ctrlMail.verifyFormAccess);

router.post('/rejectFormAccess', ctrlMail.rejectFormAccess);

router.get('/pdf/:mailID/:secret', ctrlMail.pdfForm);

/*Debugging purposes*/
router.get('/list', ctrlMail.listAllMail);



/**********************REMOVE LATER*************** */
router.post('/send', (req, res, next)=>{
    ctrlMail.sendFormAccessEmail(req.body.email, req.body.formID);
})


module.exports = router;
