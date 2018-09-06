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
	// TODO better password checks?
	if (req.body.password.length < 8) {
		req.json({success:false, meg: 'Passwords must be at least 8 characters long'});
	}
	// TODO If staff signs up with fname.lname@uwa.edu.au we dont't have number
	// Do we need it??
	User.register(User.create(req.body.name, req.body.email, req.body.number),
		req.body.password,
		(err, user) => {
			if (err) {
				// Find why the model didn't validate
				if (err.errors) // multiple errors, get first
					req.json({success:false, msg: err.errors[Object.keys(err.errors)[0]].message})
				else
					req.json({success: false, msg: err.message})
			}
			return res.json({success: true, msg: 'User Registered'});
		}
	);
};


//User Authenticate Route
//This will receive an object containining the below -
// username: req.body.username,
// password: req.body.password

//Controller will need to make sure username in db then compare password then return as below<Paste>
module.exports.authenticate = passport.authenticate('local', 
    // success
    (req, res) => {
        res.json({
            success: true,
            msg: 'You are successfully logged in',
            user: {
              username: user.username
            }
        });
    },
    // fail
    (req, res) => {
        res.json({ success: false, msg: 'User or password wrong'});
    }
);

module.exports.index = function(req, res, next) {
  res.render('index', { title: 'Express' });
}
