mongoose = require('mongoose')

var questionSchema = new mongoose.Schema(
    {
        text: {type: String, required: true},
        formName: {type: String, required: true}
    }
);

var questionSetSchema = new mongoose.Schema(
    {
        version: {type: Number, required: true},
        questionList: [{type: questionSchema, required: true}]
    }
);

module.exports.questionSetSchema = mongoose.model('QuestionSet', questionSetSchema);