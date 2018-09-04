var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/users.js')

router.get('/user/:userid', function(req, res, next) {
    res.status('200');
    res.json({'username': 'lala'});
  });

/* GET users listing. */
router.get('/user', ctrlUsers.respond);

module.exports = router;
