mongoose = require('mongoose')

var userSchema = new mongoose.Schema(
    {
        role : { type: String, required: true },
        name: { type: String, required: true },
        euser: { type: String, required: true },
        number: { type: String, required: true },
        password: { type: String, required: true },
        activeForms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
        archivedForms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }]
    }
);

module.exports.userSchema = mongoose.model('User', userSchema);
