mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')
// Mongoose doesn't actually validate uniqueness
var uniqueValidator = require('mongoose-unique-validator');
var deepPopulate = require('mongoose-deep-populate')(mongoose);


var userSchema = new mongoose.Schema(
    {
        fname: {
            type: String, required: [true, "Please enter your first name"],
            match: [/^[a-zA-z'-_]*$/, "Names can only contain letters, dashes, apostrophes, and underscores"]
        },
        lname: {
            type: String, required: [true, "Please enter your last name"],
            match: [/^[a-zA-z'-_]*$/, "Names can only contain letters, dashes, apostrophes, and underscores"]
        },
        number: {
            type: String, unique: true, required: [true, "Please enter a valid UWA staff number"],
            match: [/^\d{8,}$/, "Please enter a valid UWA staff number"]
        },
        submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
        approvals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
        isIT: Boolean
    }
);

userSchema.statics.create = (fname, lname, number) => {
    // Don't save model, passport will do that
    return new module.exports.User({
        fname: fname,
        lname: lname,
        number: number,
        approvals: [],
        submissions: [],
        isIT: false
    });
}

userSchema.plugin(uniqueValidator, {message: "{PATH} already exists"});
userSchema.plugin(passportLocalMongoose, {
    usernameField:'number',
    errorMessages: {
        MissingUsernameError: 'Please enter a valid UWA staff number',
        UserExistsError: 'A user with that UWA staff number already exists'
    }
});
userSchema.plugin(deepPopulate)
module.exports.User = mongoose.model('User', userSchema);

