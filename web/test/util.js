var User = require('../app_server/models/users.js').User

module.exports.makeUser = (fname, lname, number, password, isIT, callback) => {
    User.register(User.create(fname, lname, number, number+'@uwa.edu.au'),
                  password,
                  (err, user) => {
                      if (err || !user) {
                          console.log(err);
                          callback(err, user);
                      }
                      else if (isIT) {
                          user.isIT = true;
                          user.save(callback);
                      }
                      else callback(err, user);
                  }
    );
}
