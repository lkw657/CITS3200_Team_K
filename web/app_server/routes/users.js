var express = require('express');
var ctrlUsers = require('../controllers/users.js')
var router = express.Router();

/* GET users listing. */
router.get('/', ctrlUsers.respond);

module.exports = router;
