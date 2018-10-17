var User = require('../app_server/models/users.js').User

module.exports.makeUser = (fname, lname, number, password, isIT, callback) => {
    User.register(User.create(fname, lname, number),
                  password,
                  (err, user) => {
                      if (err) {
                          callback(err, user);
                        }
                      if (isIT) {
                          user.isIT = true;
                          user.save(callback);
                      }
                      else callback(err, user);
                  }
    );
}
