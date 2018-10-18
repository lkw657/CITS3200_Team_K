// setup the database
require('dotenv').config()
var util = require('./util')
require('../app_server/models/db.js')

var User = require('../app_server/models/users.js').User
var QuestionSet = require('../app_server/models/questionSets.js').questionSetSchema
var assert = require('chai').assert;
// use cookie jar for authentication
var request = require('request').defaults();

let ip = process.env.IP || 'localhost'
let port = process.env.PORT || '3000'
let endpointPrefix = 'http://' + ip + ':' + port

// Dummy initial question set
var qset1 = {
    version: 0,
    questionList: [
        {
            formName: "faculty",
            order: 0,
            text: "question 1",
            type: "textarea"
        },
        {
            formName: "central",
            order: 1,
            text: "question 2",
            type: "textarea"
        }
    ]
}

// To try to add in tests
var qlist2 = [
    {
        formName: "faculty",
        order: 0,
        text: "new question 1",
        type: "textarea"
    },
    {
        formName: "central",
        order: 1,
        text: "new question 2",
        type: "textarea"
    }
]

var qset2 = {version: 1, questionList: qlist2}

// Chai's deep equal will compare _id on one with the non existant _id on the other
function cmpSets(set1, set2) {
    var values = ["formName", "order", "text", "type", "title"];
    assert(set1.version == set2.version, "questionSet versions don't match");
    assert(set1.questionList.length == set2.questionList.length, "questionLists are not the same length");
    // Make sure they are ordered
    set1.questionList.sort((a,b) => a.order-b.order);
    set2.questionList.sort((a,b) => a.order-b.order);
    for (var i=0; i<set1.questionList.length; i++) {
        for (var j=0; j<values; j++) {
            assert(set1.questionList[values[j]] == set2.questionList[values[j]], "question "+values[j]+" does not match expected");
        }
    }
    return true;
}

function cmpSetList(sets1, sets2) {
    sets1.questionSets.sort((a,b) => a.version-b.version);
    sets2.questionSets.sort((a,b) => a.version-b.version);
    assert(sets1.length == sets2.length, "Wrong amount of question sets");
    for (var i=0; i<sets1.length; i++)
        cmpSets(sets1.questionSets[i], sets2.questionSets[i])
}

/* Creates a test
 * name: name of test
 * send: json object to send to the server
 * shouldReceive: json object that should be received from the server */
function test(name, shouldReceive, statusCode, login, route) {
    it(name, function (done) {
        var j = request.jar();
        request.post(endpointPrefix+'/authenticate', {json:true, form:login, jar:j}, function () {
            request.get(endpointPrefix + route, {json:true, jar:j}, function (err, res, body) { 
                assert.equal(res.statusCode, statusCode, "Did not get expected status");
                if (shouldReceive.success) {
                    if (route === '/db/questionSet')
                        cmpSetList(body, shouldReceive);
                    else
                        cmpSets(body.questionSet, shouldReceive.questionSet);
                }
                else
                    assert.deepEqual(body, shouldReceive, "Response doesn't match");
                done();
            });
        });
    });
}

function testUpdate(name, toAdd, shouldReceive, statusCode, login) {
    it(name, function(done) {
        var j = request.jar();
        this.timeout(4000);
        QuestionSet.countDocuments((err, numQsetsBefore) => {
            request.post(endpointPrefix+'/authenticate', {form: login, json:true, jar:j}, function () {
                request.post(endpointPrefix + '/db/questionSet', {body:toAdd, json:true, jar:j}, function (err, res, body) {
                    assert.equal(res.statusCode, statusCode, "Did not get expected status");
                    assert.deepEqual(body, shouldReceive, "Response doesn't match");
                    QuestionSet.countDocuments((err, numQsets) => {
                        if (shouldReceive.success)
                            assert.equal(numQsetsBefore+1, numQsets, "QuestionSet was not added");
                        else
                            assert.equal(numQsetsBefore, numQsets, "QuestionSet should not have been added");
                        done();
                    });
                });
            });
        });
    });
}

describe('QuestionSet', () => {
    // Don't use beforeEach
    // want to keep questionSet changes between tests
    before(function (done) {
            this.timeout(4000);
            User.deleteMany({}, (err) => {
                if (err) done(err);
                else
                util.makeUser('Admin', 'Admin', '00000000', 'foo', true, () => {
                    if (err) done(err);
                    else
                    util.makeUser('Johnny', 'User', '12345678', 'foo', false, () => {
                        if (err) done(err);
                        else
                        QuestionSet.deleteMany({}, (err) => {
                            if (err) done(err);
                            else
                            new QuestionSet(qset1).save((err, qset) => {
                                if (err) done(err);
                                else {
                                    module.qset1Model = qset;
                                    done();
                                }
                            });
                        });
                    });
                });
            });
    });

    describe("list all", () => {
        test("Not logged in",
            {success: false, msg: 'You do not have permission to access this page'}, 401, {}, '/db/questionSet');

        test("Logged in",
            {success: true, questionSets: [qset1]},
            200,
            {number:'12345678', password:'foo'}, '/db/questionSet');
    });

    describe("Update", () => {
        testUpdate("Not logged in", qlist2,
            {success: false, msg: 'You do not have permission to access this page'}, 401);

        testUpdate("Not IT", qlist2,
            {success: false, msg: 'You do not have permission to access this page'},
            403,
            {number:'12345678', password:'foo'});

        testUpdate("IT", qlist2,
            {success: true, msg: 'Question Set updated!'},
            200,
            {number:'00000000', password:'foo'});

    });

    describe("Latest", () => {
        test("Not logged in",
            {success: false, msg: 'You do not have permission to access this page'}, 401, {}, '/db/questionSet/latest');

        test("Logged in",
            {success: true, questionSet: qset2},
            200,
            {number:'12345678', password:'foo'},
            '/db/questionSet/latest');
    });
});
