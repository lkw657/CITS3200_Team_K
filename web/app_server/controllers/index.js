var User = require('../models/users').User;
var passport = require('passport')

//This will receive an object containining the below -
// role: req.body.role,
// email: req.body.email,
// username: req.body.username,
// password: req.body.password
//
//The controller needs to ensure the username and email are not already in db then add to db if all good then return as below

module.exports.register = (req, res) => {
    // passport-local-mongoose wants the username in a field called username, not email
    req.body.username = req.body.email
	// TODO better password checks?
	if (req.body.password.length < 8) {
		return req.json({success:false, meg: 'Passwords must be at least 8 characters long'});
	}
	// TODO If staff signs up with fname.lname@uwa.edu.au we dont't have number
	// Do we need it??
	User.register(User.create(req.body.name, req.body.email, req.body.number),
		req.body.password,
		(err, user) => {
			if (err) {
				// Find why the model didn't validate
				if (err.errors) // multiple errors, get first
					return res.json({success:false, msg: err.errors[Object.keys(err.errors)[0]].message})
				else
					return res.json({success: false, msg: err.message})
			}
			return res.json({success: true, msg: 'User Registered'});
		}
	);
};


//User Authenticate Route
//This will receive an object containining the below -
// username: req.body.username,
// password: req.body.password
//Controller will need to make sure username in db then compare password then return as below
module.exports.authenticate = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user)
            return res.json({success: false, msg: 'User or password wrong'});
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.json({
                success: true,
                msg: 'You are successfully logged in',
                user: {
                    username: user.email
                }
            });
        });
    })(req, res, next);
};

module.exports.index = function(req, res, next) {
    // login test
    if (req.user) {
        return res.render('index', { title: 'Express - Hello '+req.email });
    }
    return res.render('index', { title: 'Express' });
}
