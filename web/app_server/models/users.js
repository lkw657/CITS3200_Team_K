mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')
// Mongoose doesn't actually validate uniqueness
var uniqueValidator = require('mongoose-unique-validator');

function splitEmail(email) {
    var split = email.indexOf('@');
    if (split == -1) return {};
    return {
        name: email.substring(0, split),
        host:email.substring(split+1, email.length)
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
                        var email = splitEmail(v)
                        console.log(email)
                        switch (email.host) {
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
               required: [true, "Please enter a valid UWA email address"],
               unique: true
        },
        number: {type: String, unique: true,
                 match:[/^\d{8,}$/, "Please enter a valid studen number"]},
        forms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }]
    }
);

userSchema.statics.create = (name, email, number) => {
    // Don't save model, passport will do that
    // TODO put case in splitEmail
    var role;
    var emailPieces = splitEmail(email);
    switch (emailPieces.host) {
        case "uwa.edu.au":
            role = 'staff'
        break;
        case "student.uwa.edu.au":
            role = 'researcher'
        break;
    }
    return new module.exports.User({
        name: name,
        email: email,
        number: number,
        role: role,
        forms: []
    });
}

userSchema.plugin(uniqueValidator, {message: "{PATH} already exists"});
userSchema.plugin(passportLocalMongoose, {usernameField:'email'});
module.exports.User = mongoose.model('User', userSchema);
