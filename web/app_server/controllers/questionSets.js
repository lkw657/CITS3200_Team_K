var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;


/**
req.body.questionList

**/
module.exports.addQuestionSet = (req, res, next)=>{
    if(req.body.questionList)
    {
	QuestionSet.findOne({latest:true}).then(function(qset){
      var questionSet = new QuestionSet();
      questionSet.version=qset.version+1;	//TODO: Untested, potential error condition if this is the first questionSet.
	  //TODO: Increment versions
      questionSet.latest=true;
      //TODO: Set latest on all other question sets to false
      questionSet.questionList=req.body.questionList;
      questionSet.save((err,questionSet)=>{
        if(err){
          sendJsonResponse(res, 400, {
              error: err
          });
        }
        else{
		questionSet.update({_id:qset._id},{$set:{latest:false}})	//If saved successfully then update the old latest set to no longer being the latest.
		  sendJsonResponse(res, 201, questionSet);
        }
      })
    });
	}
    else
    {
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
    if(req.params.id=="5b964db01e7bd3273c8f66c1")
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
    else
    {
      sendJsonResponse(res, 404, {
          error: "questionSet not found"
      });
    }
    //END OF TESTING
    /*
        //Actual code. 
        //TODO: Seems to work. Check if this is right. Try findById
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
        },
        {
            _id: "5b964db01e7bd3273c8f66c5",
            text: "Please use this space to provide pertinent information that cannot fit elsewhere.",
            title: "ADDITIONAL INFORMATION",
            type: "textarea",
            formName: "Faculty"
        },
        {
            _id: "5b964db01e7bd3273c8f66c6",
            text: "Please use this space to provide pertinent information that cannot fit elsewhere.",
            title: "Purpose of Funding",
            type: "textarea",
            formName: "Central"
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
