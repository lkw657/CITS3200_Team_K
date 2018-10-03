// setup the database
require('dotenv').config()
require('../app_server/models/db.js')

var User = require('../app_server/models/users.js').User
var assert = require('chai').assert;
var request = require('request')

let ip = process.env.IP || 'localhost'
let port = process.env.PORT || '3000'
let endpoint = 'http://' + ip + ':' + port + '/register'
console.log(endpoint)

/* Creates a test
 * name: name of test
 * send: json object to send to the server
 * shouldReceive: json object that should be received from the server
 * created: whether the user should be added to the database */ 
function test(name, send, shouldReceive, created) {
    it(name, (done) => {
        request.post(endpoint, {form:send}, (err, response, body) => {
            if (err) done(err);
            // if there was a server error, we want to know why
            if (shouldReceive.success)
                assert.equal(response.statusCode, 200, "Did not get 200 OK \n"+body);
            else
                assert.equal(response.statusCode, 400, "Did not get 400 Bad Request\n"+body);
            assert.deepEqual(JSON.parse(body), shouldReceive, "Response doesn't match");
            User.find({}, (err, users) => {
                if (err) done(err);
                // should only be 1 or 0 as collection is wiped before each test
                if (created)
                    assert.lengthOf(users, 1, "User was not created");
                else
                    assert.lengthOf(users, 0, "User was created");
                done();
            });
        });
    });
}

describe('Registration', function(){

    beforeEach((done) => {
        User.remove({}, done);
    });

    test("Valid researcher",
         {fname:'aaa', lname:'bbb', number:'11111111', password:'abcdefghijkl'},
         {success: true, msg: 'User Registered'},
         true);

    test("Valid staff",
         {fname:'aaa', lname:'bbb', number:'01111111', password:'abcdefghijkl'},
         {success: true, msg: 'User Registered'},
         true);

    test("No firstname",
         {lname:'bbb', number:'11111111', password:'abcdefghijkl'},
         {success: false, msg: 'Please enter your first name'},
         false);

    test("No lastname",
         {fname:'aaa', number:'11111111', password:'abcdefghijkl'},
         {success: false, msg: 'Please enter your last name'},
         false);

    test("No number",
         {fname:'aaa', lname:'bbb', password:'abcdefghijkl'},
         {success: false, msg: 'Please enter a valid UWA staff/student number'},
         false);

    test("Invalid number",
         {fname:'aaa', lname:'bbb', number:'123a', password:'abcdefghijkl'},
         {success: false, msg: 'Please enter a valid UWA staff/student number'},
         false);

    test("Short password",
         {fname:'aaa', lname:'bbb', number:'11111111', password:'abc'},
         {success: false, msg: 'Passwords must be at least 8 characters long'},
         false);

    //TODO test existing account

});
