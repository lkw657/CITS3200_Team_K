// setup the database
require('dotenv').config()
require('../app_server/models/db.js')

var User = require('../app_server/models/users.js').User
var assert = require('chai').assert;
var request = require('request')

let ip = process.env.IP || 'localhost'
let port = process.env.PORT || '3000'
let endpoint = 'http://' + ip + ':' + port + '/register'

/* Creates a test
 * name: name of test
 * send: json object to send to the server
 * shouldReceive: json object that should be received from the server
 * created: whether the user should be added to the database */ 
function test(name, send, shouldReceive, created) {
    it(name, (done) => {
        User.countDocuments((err, initialUsers) => {
            if (err) return done(err);
            request.post(endpoint, {form:send}, (err, response, body) => {
                if (err) return done(err);
                assert.deepEqual(JSON.parse(body), shouldReceive, "Response doesn't match");
                User.countDocuments({}, (err, count) => {
                    if (err) return done(err);
                    // should only be 1 or 0 as collection is wiped before each test
                    if (created)
                        assert.equal(count, initialUsers+1, "User was not created");
                    else
                        assert.equal(count, initialUsers, "User was created");
                    done();
                });
            });
        });
    });
}

describe('Registration', function(){

    beforeEach((done) => {
        User.deleteMany({}, done);
    });

    test("Valid researcher",
         {fname:'aaa', lname:'bbb', number:'11111111', password:'abcdefghijkl'},
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
         {success: false, msg: 'Please enter a valid UWA staff number'},
         false);

    test("Invalid number",
         {fname:'aaa', lname:'bbb', number:'123a', password:'abcdefghijkl'},
         {success: false, msg: 'Please enter a valid UWA staff number'},
         false);

    test("Short password",
         {fname:'aaa', lname:'bbb', number:'11111111', password:'abc'},
         {success: false, msg: 'Passwords must be at least 8 characters long'},
         false);

    //TODO test existing account

});
