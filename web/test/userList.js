// setup the database
require('dotenv').config();
var util = require('./util');
require('../app_server/models/db.js');

var User = require('../app_server/models/users.js').User;
var assert = require('chai').assert;
// use cookie jar for authentication
var request = require('request').defaults();

let ip = process.env.IP || 'localhost';
let port = process.env.PORT || '3000';
let endpointPrefix = 'http://' + ip + ':' + port;


function cmpUser(user1, user2) {
    var values = ["fname", "lname", "email", "number", "isIT"];
    for (var j=0; j<values; j++) {
        assert(user1[values[j]] == user2[values[j]], "user "+values[j]+" does not match expected");
    }
}

function cmpUserList(users1, users2) {
    users1.sort((a,b) => a.number.localeCompare(b.number));
    users2.sort((a,b) => a.number.localeCompare(b.number));
    assert(users1.length == users2.length, "Wrong amount of users");
    for (var i=0; i<users1.length; i++)
        cmpUser(users1[i], users2[i])
}

/* Creates a test
 * name: name of test
 * shouldReceive: json object that should be received from the server 
 * statusCode: HTTP status that should be received from the server
 * login: number and password to login as
 */
function test(name, shouldReceive, statusCode, login) {
    it(name, (done) => {
        var j = request.jar();
        request.post(endpointPrefix+'/authenticate', {form: login, jar:j}, (err, loginRes, body) => {
            request.get(endpointPrefix + '/db/users', {jar: j, json:true}, (err, res, body) => {
                assert.equal(res.statusCode, statusCode, "Did not get expected status");
                if (statusCode == 200)
                    cmpUserList(body, shouldReceive);
                else
                    assert.deepEqual(body, shouldReceive, "Response doesn't match");
                done();
            });
        });
    });
}

// To compare the received use list against
users = [
    {
        number: '00000000',
        fname: 'Admin',
        lname: 'Admin',
        isIT: true
    },
    {
        number: '12345678',
        fname: 'Johnny',
        lname: 'User',
        isIT: false
    }
]

describe('User list', () => {
    describe('get', () => {

        beforeEach(function (done) {
                User.deleteMany({}, (err) => {
                    if (err) done(err);
                    util.makeUser('Admin', 'Admin', '00000000', 'foo', true, () => {
                        if (err) done(err);
                        util.makeUser('Johnny', 'User', '12345678', 'foo', false, done);
                    });
                });
        });

        test("Not logged in",
             {success: false, msg: 'You do not have permission to access this page'}, 401);
        test("Not IT",
             {success: false, msg: 'You do not have permission to access this page'}, 403, {number:'12345678', password:'foo'});
        test("IT",
             users, 200, {number:'00000000', password:'foo'});
    });
});
