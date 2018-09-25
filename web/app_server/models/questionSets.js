mongoose = require('mongoose')

var questionSchema = new mongoose.Schema(
    {
        title: {type: String},
        text: {type: String, required: true},
        // types like textarea, text, date, money, number
        type: {type: String, required: true},
        formName: {type: String, required: true}
    }
);

var questionSetSchema = new mongoose.Schema(
    {
        version: {type: Number, required: true},
        questionList: [{type: questionSchema, required: true}],
        latest: {type: Boolean, required: true}
    }
);

module.exports.questionSetSchema = mongoose.model('QuestionSet', questionSetSchema);
