mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')
// Mongoose doesn't actually validate uniqueness
var uniqueValidator = require('mongoose-unique-validator');

/* NOTE: need to make sure that if role ends up not being defined/matching an enum or whatever
   the error that caused that is sent to the used instead of something about a role which they don't know what to do with */
var userSchema = new mongoose.Schema(
    {
        role: {type: String, required: true},
        fname: {type: String, required: [true, "Please enter your first name"],
                match:[/^[a-zA-z'-_]*$/, "Names can only contain letters, dashes, apostrophes, and underscores"]},
        lname: {type: String, required: [true, "Please enter your last name"],
                match:[/^[a-zA-z'-_]*$/, "Names can only contain letters, dashes, apostrophes, and underscores"]},
        number: {type: String, unique: true, required: [true, "Please enter a valid UWA staff/student number"],
                 match:[/^\d{8,}$/, "Please enter a valid UWA staff/student number"]},
        forms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }]
    }
);

userSchema.statics.create = (fname, lname, number) => {
    // Don't save model, passport will do that
    // TODO put case in splitEmail
    var role = '';
    // if it's undefined the model validation should catch the error
    if (number != undefined) {
        if (number.charAt(0) == '0')
            role = 'staff'
        else
            role = 'researcher'
    }
    return new module.exports.User({
        fname: fname,
        lname: lname,
        number: number,
        role: role,
        forms: []
    });
}

userSchema.plugin(uniqueValidator, {message: "{PATH} already exists"});
userSchema.plugin(passportLocalMongoose, {
    usernameField:'number',
    errorMessages: {
        MissingUsernameError: 'Please enter a valid UWA staff/student number',
        UserExistsError: 'A user with that UWA staff/student number already exists'
    }
});
module.exports.User = mongoose.model('User', userSchema);
