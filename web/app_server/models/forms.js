mongoose = require('mongoose')

var formSchema = new mongoose.Schema(
    {
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    // creation date, firt sign dant, 2nd sign date, etc...
    dates: [{type: Date, required: true}],
    questionSet: {type: mongoose.Schema.Types.ObjectId, ref:'QuestionSet', required: true},
    answers: [{ type: String, required: true }],
    allocatedStaff: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: {type: String, required: true},
    history: {type: mongoose.Schema.Types.ObjectId, ref:'Form'},
    approvedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: {
        commenter: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
        comment: String
    }
    }
);

module.exports.formSchema = mongoose.model('Form', formSchema);
