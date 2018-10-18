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

/* Creates a test
 * name: name of test
 * send: json object to send to the server
 * shouldReceive: json object that should be received from the server */
function test(name, shouldReceive, statusCode, login) {
    it(name, (done) => {
        var j = request.jar();
        request.post(endpointPrefix+'/authenticate', {form: login, jar:j}, (err, loginRes, body) => {
            request.get(endpointPrefix + '/db/users', {jar: j}, (err, res, body) => {
                assert.equal(res.statusCode, statusCode, "Did not get expected status");
                assert.deepEqual(JSON.parse(body), shouldReceive, "Response doesn't match");
                done();
            });
        });
    });
}

describe('User list', () => {
    describe('get', () => {

        beforeEach(function (done) {
            this.timeout(4000);
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
    });
});
