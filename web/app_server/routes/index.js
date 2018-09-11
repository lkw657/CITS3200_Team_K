var express = require('express');
var ctrlIndex = require('../controllers/index')
var router = express.Router();

/* GET home page. */
router.get('/', ctrlIndex.index);
router.post('/authenticate', ctrlIndex.authenticate);
router.post('/register', ctrlIndex.register)

module.exports = router;
