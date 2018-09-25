mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')
// Mongoose doesn't actually validate uniqueness
var uniqueValidator = require('mongoose-unique-validator');


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
            type: String, unique: true, required: [true, "Please enter a valid UWA staff/student number"],
            match: [/^\d{8,}$/, "Please enter a valid UWA staff/student number"]
        },
        forms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
        isIT: Boolean
    }
);

userSchema.statics.create = (fname, lname, number) => {
    // Don't save model, passport will do that
    return new module.exports.User({
        fname: fname,
        lname: lname,
        number: number,
        forms: [],
        isIT: 'false'
    });
}

userSchema.plugin(uniqueValidator, { message: "{PATH} already exists" });
userSchema.plugin(passportLocalMongoose, { usernameField: 'number' });
module.exports.User = mongoose.model('User', userSchema);

