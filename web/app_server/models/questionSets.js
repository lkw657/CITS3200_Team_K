mongoose = require('mongoose')

var questionSchema = new mongoose.Schema(
    {
        title: {type: String, required: false},	//Title of the question
        text: {type: String, required: true},	//Body text for the question
        type: {type: String, required: true},	// types like textarea, text, date, money, number
        formName: {type: String, required: true},	//What form the question belongs to (faculty or central)
        order: {type: Number, required: true}
    }
);

var questionSetSchema = new mongoose.Schema(
    {
        version: {type: Number, required: true},	//Used for archiving purposes.
        questionList: [{type: questionSchema, required: true}],	//All the questions that are part of the set
    }
);

module.exports.questionSetSchema = mongoose.model('QuestionSet', questionSetSchema);
