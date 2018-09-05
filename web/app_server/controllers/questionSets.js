var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;


/**
req.body.questionList

**/
module.exports.addQuestionSet = (req, res, next)=>{
    if(req.body.questionList)
    {
      var questionSet = new QuestionSet();
  
      questionSet.version=1;
      questionSet.questionList=req.body.questionList;
  
      questionSet.save((err,questionSet)=>{
        if(err){
          sendJsonResponse(res, 400, {
              error: err
          });
        }
        else{
          sendJsonResponse(res, 201, questionSet);
        }
      })
    }
    else
    {
      sendJsonResponse(res, 400, {
          error: "missing data"
      });
    }
}

module.exports.listAll = (req, res, next) => {
    QuestionSet.find({}, '', (err, qsets) => {
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
    })
}

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}
