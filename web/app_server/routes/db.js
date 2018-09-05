var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/users.js')



/* GET users listing. */
router.get('/user', ctrlUsers.respond);

// User routes
router.post('/user/create', ctrlUsers.addUser);
router.get('/user/list', ctrlUsers.listAll);

router.get('/user/:userid', function(req, res, next) {
    res.status('200');
    res.json({'username': 'lala'});
});

module.exports = router;
