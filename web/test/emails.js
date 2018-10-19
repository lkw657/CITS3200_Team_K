// setup the database
require('dotenv').config()
var util = require('./util')
require('../app_server/models/db.js')

var User = require('../app_server/models/users.js').User
var Email = require('../app_server/models/emails.js').emailSchema
var assert = require('chai').assert;
// use cookie jar for authentication
var request = require('request').defaults();

let ip = process.env.IP || 'localhost'
let port = process.env.PORT || '3000'
let endpointPrefix = 'http://' + ip + ':' + port

// Dummy initial email
var email1 = {
    "role": "School of Engineering HoS",
    "email": "a@a.com",
    "emailContent":"content here"
}

// To try to update
var email2 = {
    "role": "School of Engineering HoS",
    "email": "b@b.com",
    "emailContent":"content here"
}

// Chai's deep equal will compare _id on one with the non existant _id on the other
function cmpEmails(email1, email2) {
    var values = ["role", "email", "emailContent"];
    for (var j=0; j<values; j++) {
        assert(email1[values[j]] == email2[values[j]], "email "+values[j]+" does not match expected");
    }
    return true;
}

function cmpEmailList(emails1, emails2) {
    assert(emails1.length == emails2.length, "Wrong amount of emails");
    emails1.sort((a,b) => a.role.localeCompare(b.role));
    for (var i=0; i<emails1.length; i++)
        cmpEmails(emails1[i], emails2[i]);
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
                if (statusCode == 200)
                    cmpEmailList(shouldReceive, body)
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
        request.post(endpointPrefix+'/authenticate', {form: login, json:true, jar:j}, function () {
            Email.findOne({role: 'School of Engineering HoS'}, (err, email) => {
                if (err) return done(err);
                toAdd._id = email._id;
                request.put(endpointPrefix + '/email/updateEmail', {body:toAdd, json:true, jar:j}, function (err, res, body) {
                    assert.equal(res.statusCode, statusCode, "Did not get expected status");
                    assert.deepEqual(body, shouldReceive, "Response doesn't match");
                    if (statusCode == 200) {
                        Email.findById(email._id, (err, updatedEmail) => {
                            if (err) return done(err)
                            cmpEmails(toAdd, updatedEmail);
                            done();
                        });
                    }
                    else done();
                });
            });
        });
    });
}

describe('Email', () => {
    // Don't use beforeEach
    // want to keep questionSet changes between tests
    before(function (done) {
            User.deleteMany({}, (err) => {
                if (err) done(err);
                else
                util.makeUser('Admin', 'Admin', '00000000', 'foo', true, () => {
                    if (err) done(err);
                    else
                    util.makeUser('Johnny', 'User', '12345678', 'foo', false, () => {
                        if (err) done(err);
                        else
                        Email.deleteMany({}, (err) => {
                            if (err) done(err);
                            else
                            new Email(email1).save(done);
                        });
                    });
                });
            });
    });

    describe("list all", () => {
        test("Not logged in",
            {success: false, msg: 'You do not have permission to access this page'}, 
            401, 
            {},
            '/email/list');

        test("Not IT",
            {success: false, msg: 'You do not have permission to access this page'}, 
            403, 
            {number:'12345678', password:'foo'}, 
            '/email/list');

        test("IT",
            [email1],
            200,
            {number:'00000000', password:'foo'}, '/email/list');
    });

    describe("Update", () => {
        testUpdate("Not logged in", email2,
            {success: false, msg: 'You do not have permission to access this page'}, 401);

        testUpdate("Not IT", email2,
            {success: false, msg: 'You do not have permission to access this page'},
            403,
            {number:'12345678', password:'foo'});

        testUpdate("IT", email2,
            {success: true, msg: 'Email Updated'},
            200,
            {number:'00000000', password:'foo'});

    });
});
