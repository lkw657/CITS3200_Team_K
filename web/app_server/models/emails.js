mongoose = require('mongoose')

var emailSchema = new mongoose.Schema(
    {
        role: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        emailContent: { type: String }
    }
);

module.exports.emailSchema = mongoose.model('Email', emailSchema);