mongoose = require('mongoose')

var formSchema = new mongoose.Schema(
    {
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},	//The researcher
    dates: [{type: Date, required: true}],	// creation date, firt sign dant, 2nd sign date, etc...
    questionSet: {type: mongoose.Schema.Types.ObjectId, ref:'QuestionSet', required: true},	//The latest question set at the time of creation
    answers: [{ type: String, required: true }],	//Researcher's answers to the questions in the question set.
    allocatedStaff: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},	//Users who are acting as HoS, AD(R), etc. for this form. 
    status: {type: String, required: true},	//If the form is completed, rejected, etc.
    history: {type: mongoose.Schema.Types.ObjectId, ref:'Form'},	//Old versions of the form.
    approvedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],	//Users (HoS, etc.) who have approved the form.
    comments: {	//Comments for provisional yes/no.
        commenter: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
        comment: String
    },
	school: {type: String, required: true}	//What school the researcher belongs to, determines HoS to send to.
    }
);

module.exports.Form = mongoose.model('Form', formSchema);
