var express = require('express');
var ctrlIndex = require('../controllers/index')
var router = express.Router();

/* GET home page. */
router.post('/authenticate', ctrlIndex.authenticate);
router.post('/logOut', ctrlIndex.logOut);
router.post('/register', ctrlIndex.register)

//Dashboard API
router.get('/submissions', ctrlIndex.submissions);
router.get('/approvals', ctrlIndex.approvals);
router.post('/formHistory', ctrlIndex.formHistory);

module.exports = router;
