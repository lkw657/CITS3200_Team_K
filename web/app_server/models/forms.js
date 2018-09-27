mongoose = require('mongoose')

var approvedBySchema = new mongoose.Schema(
    {
        role: {type: String, required: true},	//Title of the question
        id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},	//Body text for the question
    }
);

var commentSchema = new mongoose.Schema(
    {
        questionNumber: {type: Number, required: true},	//Title of the question
        comment: {type: String, ref: 'User', required: true},	//Body text for the question
        commenter: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
    }
);

var formSchema = new mongoose.Schema(
    {
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},	//The researcher
    dates: [{type: Date, required: true}],	// creation date, first sign date, 2nd sign date, etc...
    questionSet: {type: mongoose.Schema.Types.ObjectId, ref:'QuestionSet', required: true},	//id of the questionSet
    answers: [{ type: String, required: true }],	//Researcher's answers to the questions in the question set.
    allocatedStaff: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},	//Users who are acting as HoS, AD(R), etc. for this form. 
    status: {type: String, required: true},	//If the form is completed, rejected, etc.
    history: [{type: mongoose.Schema.Types.ObjectId, ref:'Form'}],	//Old versions of the form.
    approvedBy: [{type: approvedBySchema}],	//Users (HoS, etc.) who have approved the form.
    comments: [{type: commentSchema}],
    school: {type: String, required: true},	//What school the researcher belongs to, determines HoS to send to.
    submitter: {type: String, required: true}
    }
);

module.exports.Form = mongoose.model('Form', formSchema);
