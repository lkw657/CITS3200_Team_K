mongoose = require('mongoose')

var userSchema = new mongoose.Schema(
    {
        role : { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        number: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        forms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }]
    }
);

module.exports.userSchema = mongoose.model('User', userSchema);
