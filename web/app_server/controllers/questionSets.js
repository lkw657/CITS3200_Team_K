var questionSetModel = require('../models/questionSets');
var QuestionSet = questionSetModel.questionSetSchema;

module.exports.addQuestionSet = (req, res, next) => {
    if (req.user == undefined || !req.user.isIT) {
        var stat = req.user == undefined ? 401 : 403
        return res.status(stat).json({
            success: false,
            msg: "You do not have permission to access this page"
        });
    }
    //Check if a questionlist is included.
    if (!req.body) {
        return res.json({ success: false, msg: 'Missing Data' });
    }
    //Find the question set with the highest version.
    QuestionSet.find({}, { _id: 0, 'questionList._id': 0 }).sort({ version: -1 }).limit(1).exec(function (err, qsets) {
        var qset = qsets[0];
        if (err) {
            console.log(err);
            return res.json({success:false, msg:"Error getting question list"});
        }
        var questionSet = new QuestionSet(); //The question set to be saved.
        //If no questionSet was returned earlier then set the version to 1. Otherwise the version is 1 greater than the latest.
        if (qset) {
            //If the latest question list is identical to the new question list then abort.
            if (isEqual(qset.questionList, req.body))
                return res.json({
                    success: false,
                    msg: 'No questions have been changed, please check and resubmit'
                });
            questionSet.version = qset.version + 1;
        }
        else
            questionSet.version = 1;
        // set order on questions
		questionSet.questionList=req.body.sort(
        function (a, b) {
            var x = a.order;
            var y = b.order;
            return x-y;
        });

        questionSet.save((err, questionSet) => {
            if (err)
                return res.json({ success: false, msg: 'Could not update Question Set' });
            else
                return res.json({ success: true, msg: 'Question Set updated!' });
        });
    });
}

//Checks if the two given questionList arrays are the same.
var isEqual = function (first, second) {
    if (first.length != second.length)    //Check if the arrays are of the same length.
        return false;
    //sort based on question order.
    first.sort(
        function (a, b) {
            var x = a.order;
            var y = b.order;
            return x-y;
        });
    //sort based on question order.
    second.sort(
        function (a, b) {
            var x = a.order;
            var y = b.order;
            return x-y;
        });
    if (JSON.stringify(first) != JSON.stringify(second))    //Check if sorted arrays are the same.
        return false;
    return true;    // If nothing failed, return true

};

module.exports.listAll = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            msg: "You do not have permission to access this page"
        });
    }
    QuestionSet.find({}, (err, qsets) => {
        if (err) {
            return res.json({
                success: false,
                msg: "Error getting question list"
            });
            console.log(err);
        }
        else {
            res.json({
                success: true,
                questionSets: qsets
            });
        }
    })
}

//Returns the question set that has the same id in the database.
module.exports.questionSetId = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            msg: "You do not have permission to access this page"
        });
    }
    QuestionSet.findById(req.params.id).then(function (qset, err) {
        if (err) {
            return res.json({
                success: false,
                msg: "Error getting question list"
            });
            console.log(err);
        }
        res.json({
            success: true,
            questionSet: qset
        });
    })
}

//Returns the latest 
module.exports.latestQuestionSet = (req, res, next) => {
    //Find the question set with the highest version.
    if (!req.user) {
        return res.status(401).json({
            success: false,
            msg: "You do not have permission to access this page"
        });
    }
    QuestionSet.findOne({}, { 'questionList._id': 0 }).sort({ version: -1 }).exec(function (err, qset) {
        if (err) {
            return res.json({
                success: false,
                msg: "Error getting question list"
            });
            console.log(err);
        }
        res.json({
            success: true,
            questionSet: qset
        });
    });
}
