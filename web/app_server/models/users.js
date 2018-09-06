mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')
// Mongoose doesn't actually validate uniqueness
var uniqueValidator = require('mongoose-unique-validator');

function splitEmail(email) {
    var split = email.indexOf('@');
    if (split == -1) return {};
    return {name: v.substring(0, split),
        host:v.substring(split+1, v.length)
    };
}

var userSchema = new mongoose.Schema(
    {
        role : {type: String, required: true},
        name : {type: String, required: true, 
                match:[/^[a-zA-z'-_ ]*$/, "Names can only contain letters, dashes, apostrophes, underscores and spaces"]},
        email: {type: String,
                validate: {
                   validator: (v) => {
                        var email = splitEmail()
                        switch (host) {
                            // TODO any others?
                            case "uwa.edu.au":
                                // TODO check this
                                return /^\d{8,}$/.test(email.name) || /\w*\.\w*$/.test(email.name) 
                            break;
                            case "student.uwa.edu.au":
                                return /^\d{8,}$/.test(email.name)
                            break;
                            default:
                                return false
                        }
                    },
                    message: "Please enter a valid UWA email address"
                },
               required: [true, "Please enter a username"],
               unique: true
        },
        number: {type: String, unique: true,
                 match:[/^\d{8,}$/, "Please enter a valid studen number"]},
        password: {type: String, required: true},
        forms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }]
    }
);

userSchema.methods.create = (name, email, number) => {
    // Don't save model, passport will do that
    // TODO put case in splitEmail
    var role;
    switch (host) {
        case "uwa.edu.au":
            role = 'staff'
        break;
        case "student.uwa.edu.au":
            role = 'researcher'
        break;
    }
    return new User({
        name: req.body.name,
        email: req.body.email,
        number: req.body.phone,
        role: role,
        forms: []
    })
}

userSchema.plugin(uniqueValidator, {message: "{PATH} already exists"});
userSchema.plugin(passportLocalMongoose);
module.exports.User = mongoose.model('User', userSchema);
