var User = require('../models/users').User;
var passport = require('passport')

//This will receive an object containining the below -
// first name: req.body.fname
// last name: req.body.lname
// number: req.body.number,
// password: req.body.password
module.exports.register = (req, res) => {
    // passport-local-mongoose wants the username in a field called username, not email
    //req.body.username = req.body.email
	// TODO better password checks?
	if (req.body.password.length < 8) {
		return res.json({success:false, msg: 'Passwords must be at least 8 characters long'});
	}
	var digits = Math.floor(Math.log(req.body.number) / Math.LN10 + 1);
	if (digits != 8) {
		return res.json({success:false, msg: 'Passwords must be at least 8 characters long'});
	}
	User.register(User.create(req.body.fname, req.body.lname, req.body.number),
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
// number: req.body.number,
// password: req.body.password
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
                    fname: user.fname,
                    lname: user.lname,
                    number: user.number,
                    isIT: user.isIT,
                    submissions: user.submissions,
                    approvals: user.approvals
                }
            });
        });
    })(req, res, next);
};

module.exports.submissions = (req, res, next) => {
    if(!res.user)
        return res.status(401).json({
            success: false,
            msg: "forbidden"
        });
    user.populate(['submissions', 'submissions.questionSet'], (err) => {
        if (err)
            return res.status(400).json({
                success: false,
                msg: "error"
            });
        res.json({
            success: true,
            submissions: user.submissions
        });
    });
}

module.exports.approvals = (req, res, next) => {
    if(!res.user)
        return res.status(401).json({
            success: false,
            msg: "forbidden"
        });
    user.populate(['approvals', 'approvals.questionSet'], (err) => {
        if (err)
            return res.status(400).json({
                success: false,
                msg: "error"
            });
        res.json({
            success: true,
            submissions: user.approvals
        });
    });
}

// This isn't actually called since I told the express generator not to use templates
// I'm not entirely sure why it generated this funciton
module.exports.index = function(req, res, next) {
    console.log(req.user)
    if (req.user) {
        return res.render('index', { title: 'Express - Hello '+req.user.fname});
    }
    return res.render('index', { title: 'Express' });
}
