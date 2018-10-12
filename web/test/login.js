// setup the database
require('dotenv').config()
require('../app_server/models/db.js')

var User = require('../app_server/models/users.js').User
var assert = require('chai').assert;
var request = require('request')

let ip = process.env.IP || 'localhost'
let port = process.env.PORT || '3000'
let endpoint = 'http://' + ip + ':' + port + '/authenticate'

/* Creates a test
 * name: name of test
 * send: json object to send to the server
 * shouldReceive: json object that should be received from the server
 * created: whether the user should be added to the database */ 
function test(name, send, shouldReceive) {
    it(name, (done) => {
        request.post(endpoint, {form:send}, (err, res, body) => {
            if (err) done(err);
            if (shouldReceive.success) {
                // make sure a cookie is set
                assert.property(res.headers, 'set-cookie');
            }
            else {
                assert.notProperty(res.headers, 'set-cookie')
            }
            assert.deepEqual(JSON.parse(body), shouldReceive, "Response doesn't match");
            done();
        });
    });
}

describe('Login', () => {
    beforeEach(function (done) {
        /* Delete the collection and add a researcher and staff user for testing */
        this.timeout(4000);
        User.remove({}, (err) => {
            User.register(User.create('researcher', 'user','12345678'),
                          'abcdefghijkl', (err) => done(err));
        });
    });

    test("Valid login",
         {number:'12345678', password:'abcdefghijkl'},
         {success: true, msg: 'You are successfully logged in', user: {
             fname:'researcher',
             lname:'user',
             number:'12345678',
             isIT: false,
             approvals: [],
             submissions:[]}});

    test("Missing number",
         {password:'abcdefghijkl'},
         {success: false, msg: 'User or password wrong'}); 

    test("Missing password",
         {number:'12345678'},
         {success: false, msg: 'User or password wrong'}); 

    test("Unknown user",
         {number:'11111111',password:'abcdefghijkl'},
         {success: false, msg: 'User or password wrong'}); 

    test("Invalid password",
         {number:'12345678',password:'aaa'},
         {success: false, msg: 'User or password wrong'}); 
});
