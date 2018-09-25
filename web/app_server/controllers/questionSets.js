var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;


/**
req.body.questionList

**/
module.exports.addQuestionSet = (req, res, next)=>{
    if(req.body.questionList)	//Check if a questionlist is included.
    {
		QuestionSet.findOne({},{_id: 0,'questionList._id':0}).sort({version:-1}).then(function(qset){	//Find the question set with the highest version.
			var questionSet = new QuestionSet();	//The question set to be saved.
			//If no questionSet was returned earlier then set the version to 1. Otherwise the version is 1 greater than the latest.
			if (qset)	{	
				if(isEqual(qset.questionList,req.body.questionList))
					return res.json({ success: false, msg: 'Same Question List' });	//If the latest question list is identical to the new question list then abort.
				questionSet.version = qset.version+1;
			}
			else {
				questionSet.version = 1;
			}
			questionSet.questionList=req.body.questionList;
			questionSet.save((err, questionSet) => {
				if (err) {
					return res.json({ success: false, msg: 'Could not update Question Set' });
				}
				else {
					return res.json({ success: true, msg: 'Question Set updated!' });
				}
			})
		});
		}
    else
    {
      return res.json({ success: false, msg: 'Missing Data' });
    }
}

//Checks if the two given questionList arrays are the same, regardless of order.
var isEqual = function (first, second) {
	if(first.length!=second.length)	//Check if the arrays are of the same length.
		return false;
	first.sort(	//sort based on question title.
		function(a, b){
		var x = a.title.toLowerCase();
		var y = b.title.toLowerCase();
		if (x < y) {return -1;}
		if (x > y) {return 1;}
		return 0;
	});
	second.sort(	//sort based on question title.
		function(a, b){
		var x = a.title.toLowerCase();
		var y = b.title.toLowerCase();
		if (x < y) {return -1;}
		if (x > y) {return 1;}
		return 0;
	});
	if(JSON.stringify(first)!=JSON.stringify(second))	//Check if sorted arrays are the same.
		return false;
	return true;	// If nothing failed, return true

};

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
            title: "ALIGNMENT WITH faculty STRATEGIC VISION",
            type: "textarea",
            formName: "Faculty"
        },
        {
            _id: "5b964db01e7bd3273c8f66c3",
            text: "Provide a brief statement outlining how your proposal aligns with the Faculty’s strategic research priorities (Engineering for Remote Operations, Science of Discovery or Technologies for Better Health) or an emerging strategic research priority.",
            title: "ALIGNMENT WITH FACULTY STRATEGIC RESEARCH PRIORITIES",
            type: "textarea",
            formName: "faculty"
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
            formName: "faculty"
        },
        {
            _id: "5b964db01e7bd3273c8f66c3",
            text: "Provide a brief statement outlining how your proposal aligns with the Faculty’s strategic research priorities (Engineering for Remote Operations, Science of Discovery or Technologies for Better Health) or an emerging strategic research priority.",
            title: "ALIGNMENT WITH FACULTY STRATEGIC RESEARCH PRIORITIES",
            type: "textarea",
            formName: "faculty"
        },
        {
            _id: "5b964db01e7bd3273c8f66c2",
            text: "Please provide a brief statement as to how this investment will return value to the Faculty.",
            title: "RETURN ON INVESTMENT",
            type: "textarea",
            formName: "faculty"
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
            formName: "faculty"
        },
        {
            _id: "5b964db01e7bd3273c8f66c3",
            text: "Provide a brief statement outlining how your proposal aligns with the Faculty’s strategic research priorities (Engineering for Remote Operations, Science of Discovery or Technologies for Better Health) or an emerging strategic research priority.",
            title: "ALIGNMENT WITH FACULTY STRATEGIC RESEARCH PRIORITIES",
            type: "textarea",
            formName: "faculty"
        },
        {
            _id: "5b964db01e7bd3273c8f66c2",
            text: "Please provide a brief statement as to how this investment will return value to the Faculty.",
            title: "RETURN ON INVESTMENT",
            type: "textarea",
            formName: "faculty"
        },
        {
            _id: "5b964db01e7bd3273c8f66c5",
            text: "Please use this space to provide pertinent information that cannot fit elsewhere.",
            title: "ADDITIONAL INFORMATION",
            type: "textarea",
            formName: "faculty"
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
        QuestionSet.findOne().sort({version:-1}).then(function(qset){
            res.send(qset);
        })
    */
}    


var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}
