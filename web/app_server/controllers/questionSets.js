var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;

/*
    req.body = The new list of questions, the below successfully adds this as a new questionSet

    STILL TO BE CODED
    1) NEED TO MAKE SURE AT LEAST ONE QUESTION IS DIFFERENT FROM CURRENT LATEST
    2) CURRENT LATEST NEEDS TO BE SET TO FALSE
*/

module.exports.addQuestionSet = (req, res, next) => {
    if (req.body) {

        var questionSet = new QuestionSet();

        questionSet.version = 1;
        questionSet.latest = true;
        //TODO: Set latest on all other question sets to false
        questionSet.questionList = req.body;

        questionSet.save((err, questionSet) => {
            if (err) {
                return res.json({ success: false, msg: 'Could not update Question Set' });
            }
            else {
                return res.json({ success: true, msg: 'Question Set updated!' });
            }
        })
    }
    else {
        sendJsonResponse(res, 400, {
            error: "missing data"
        });
    }
}

module.exports.listAll = (req, res, next) => {
    /*QuestionSet.find({}, '', (err, qsets) => {
        if (!mails) {
            sendJsonResponse(res, 403, {
                error: "forbidden"
            });
        }
        else if (err) {
            sendJsonResponse(res, 404, {
                error: "forbidden"
            });
            console.log(err);
        }
        else {
            sendJsonResponse(res, 200, qsets);
        }
    })*/

    //FOR TESTING, DELETE FROM THIS LINE
    res.json(
        [
            {
                _id: "5b964db01e7bd3273c8f66c1",
                questionList: [
                    {
                        _id: "5b964db01e7bd3273c8f66c4",
                        text: "Provide a brief statement outlining how your proposal aligns with the Faculty’s Strategic Vision.",
                        title: "ALIGNMENT WITH FACULTY STRATEGIC VISION",
                        type: "textarea",
                        formName: "Faculty"
                    },
                    {
                        _id: "5b964db01e7bd3273c8f66c3",
                        text: "Provide a brief statement outlining how your proposal aligns with the Faculty’s strategic research priorities (Engineering for Remote Operations, Science of Discovery or Technologies for Better Health) or an emerging strategic research priority.",
                        title: "ALIGNMENT WITH FACULTY STRATEGIC RESEARCH PRIORITIES",
                        type: "textarea",
                        formName: "Faculty"
                    },
                    {
                        _id: "5b964db01e7bd3273c8f66c2",
                        text: "Please provide a brief statement as to how this investment will return value to the Faculty.",
                        title: "RETURN ON INVESTMENT",
                        type: "textarea",
                        formName: "Faculty"
                    }
                ],
                version: 1,
                latest: true,
                __v: 0
            },
            {
                _id: {
                    $oid: "5b950fb5dd0d6c3304cea2b3"
                },
                questionList: [
                    {
                        _id: {
                            $oid: "5b950fb5dd0d6c3304cea2b6"
                        },
                        text: "Question Text",
                        title: "Question title",
                        type: "Question type",
                        formName: "Form Name"
                    },
                    {
                        _id: {
                            $oid: "5b950fb5dd0d6c3304cea2b5"
                        },
                        text: "Question Text 2",
                        title: "Question Title 2",
                        type: "Question type 2",
                        formName: "Form Name 2"
                    },
                    {
                        _id: {
                            $oid: "5b950fb5dd0d6c3304cea2b4"
                        },
                        text: "Question Text 3",
                        title: "Question title 3",
                        type: "Question type 3",
                        formName: "Form Name 3"
                    }
                ],
                version: 1,
                latest: false,
                __v: 0
            }
        ]
    );
    //TO THIS LINE
}

//Returns the question set that has the same id in the database.
module.exports.questionSetId = (req, res, next) => {
    //FOR TESTING
    if (req.params.id == "5b964db01e7bd3273c8f66c1")
        res.json(
            {
                _id: "5b964db01e7bd3273c8f66c1",
                questionList: [
                    {
                        _id: "5b964db01e7bd3273c8f66c4",
                        text: "Provide a brief statement outlining how your proposal aligns with the Faculty’s Strategic Vision.",
                        type: "ALIGNMENT WITH FACULTY STRATEGIC VISION",
                        type: "textarea",
                        formName: "Faculty"
                    },
                    {
                        _id: "5b964db01e7bd3273c8f66c3",
                        text: "Provide a brief statement outlining how your proposal aligns with the Faculty’s strategic research priorities (Engineering for Remote Operations, Science of Discovery or Technologies for Better Health) or an emerging strategic research priority.",
                        title: "ALIGNMENT WITH FACULTY STRATEGIC RESEARCH PRIORITIES",
                        type: "textarea",
                        formName: "Faculty"
                    },
                    {
                        _id: "5b964db01e7bd3273c8f66c2",
                        text: "Please provide a brief statement as to how this investment will return value to the Faculty.",
                        title: "RETURN ON INVESTMENT",
                        type: "textarea",
                        formName: "Faculty"
                    }
                ],
                version: 1,
                latest: true,
                __v: 0
            }
        );
    else {
        sendJsonResponse(res, 404, {
            error: "questionSet not found"
        });
    }
    //END OF TESTING
    /*
        //Actual code. 
        //TODO: Seems to work. Check if this is right.
        QuestionSet.findOne({_id:req.params.id}).then(function(qset){
            res.send(qset);
        })
    */
}

//Returns the latest 
module.exports.latestQuestionSet = (req, res, next) => {
    //FOR TESTING
    res.json(
        {
            _id: "5b964db01e7bd3273c8f66c1",
            questionList: [
                {
                    _id: "5b964db01e7bd3273c8f66c4",
                    text: "Provide a brief statement outlining how your proposal aligns with the Faculty’s Strategic Vision.",
                    title: "ALIGNMENT WITH FACULTY STRATEGIC VISION",
                    type: "textarea",
                    formName: "Faculty"
                },
                {
                    _id: "5b964db01e7bd3273c8f66c3",
                    text: "Provide a brief statement outlining how your proposal aligns with the Faculty’s strategic research priorities (Engineering for Remote Operations, Science of Discovery or Technologies for Better Health) or an emerging strategic research priority.",
                    title: "ALIGNMENT WITH FACULTY STRATEGIC RESEARCH PRIORITIES",
                    type: "textarea",
                    formName: "Faculty"
                },
                {
                    _id: "5b964db01e7bd3273c8f66c2",
                    text: "Please provide a brief statement as to how this investment will return value to the Faculty.",
                    title: "RETURN ON INVESTMENT",
                    type: "textarea",
                    formName: "Faculty"
                }
            ],
            version: 1,
            latest: true,
            __v: 0
        }
    );
    //END OF TESTING
    /*
        //Actual code. 
        //TODO: Seems to work. Check if this is right.
        QuestionSet.findOne({latest:true}).then(function(qset){
            res.send(qset);
        })
    */
}


var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}
