var mongoose = require('mongoose')

var dbURI;
if (process.env.DB_URI === undefined) {
    dbURI = 'mongodb://db:27017/website';
}
else {
    dbURI = process.env.DB_URI;
}

mongoose.connection.on('conected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
    console.log('retrying...');
    mongoose.connect(dbURI);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

mongoose.connect(dbURI, {useNewUrlParser: true});

gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
  
// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});
