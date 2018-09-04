var mongoose = require('mongoose');

/*****************************************************/
/*******************MAIL******************************/
/*****************************************************/
var mailSchema = new mongoose.Schema(
    {
        type : { type: String, required: true },
        secret: { type: String },
        formID: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' }
    }
);

// hash is AES encrypted formID+randomString(length 10) with a random password
mailSchema.methods.generateSecret = function(){
    this.secret = generateRandomString();
    console.log(this.secret)
    console.log(generateRandomString());
};


function generateRandomString() {
    var str = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
        str += possible.charAt(Math.floor(Math.random() * possible.length));
    return str;
}

module.exports.mailSchema = mongoose.model('Mail', mailSchema);
