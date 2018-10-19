mongoose = require('mongoose')

var approvedBySchema = new mongoose.Schema(
    {
        role: {type: String, required: true},	//Role of approver
        id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},	//Approver _id
    }
);

var commentSchema = new mongoose.Schema(
    {
        order: {type: Number, required: true},	//Question number comment is for
        text: {type: String, required: true},	//Comment text
        commenter: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true} //_id of commenter
    }
);

var answerSchema = new mongoose.Schema(
    {
        order: {type: Number, required: true},	//Question number answer is for
        answer: {type: String, required: true},	//Body text for the answer
    }
);

var formSchema = new mongoose.Schema(
    {
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},	//The researcher
    dates: [{type: Date, required: true}],	// creation date, first sign date, 2nd sign date, etc...
    questionSet: {type: mongoose.Schema.Types.ObjectId, ref:'QuestionSet', required: true},	//id of the questionSet
    answers: [{ type: answerSchema, required: true }],	//Researcher's answers to the questions in the question set.
    allocatedStaff: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},	//Users who are acting as HoS, AD(R), etc. for this form. 
    status: {type: String, required: true},	//If the form is completed, rejected, etc.
    history: [{type: mongoose.Schema.Types.ObjectId, ref:'Form'}],	//Old versions of the form.
    approvedBy: [{type: approvedBySchema}],	//Users (HoS, etc.) who have approved the form.
    comments: [{type: commentSchema}],
    school: {type: String, required: true},	//What school the researcher belongs to, determines HoS to send to.
    submitter: {type: String, required: true},
    rejectionRole : {type: String}
    }
);

module.exports.Form = mongoose.model('Form', formSchema);
