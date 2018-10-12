var mongoose = require('mongoose');
var crypto = require('crypto');

/*****************************************************/
/*******************MAIL******************************/
/*****************************************************/
var mailSchema = new mongoose.Schema(
    {
        type : { type: String, required: true },
        secret: { type: String },
        formID: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
        status: String
    }
);

mailSchema.methods.generateSecret = function(callback){
    crypto.randomBytes(32, function(err, buffer) {
        console.log(buffer);
        this.secret = buffer.toString('hex');
        console.log(this.secret);
        callback(this.secret);
      });
};


module.exports.mailSchema = mongoose.model('Mail', mailSchema);
