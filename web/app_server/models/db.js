var mongoose = require('mongoose')

var dbURI = 'mongodb://db:27017/website'

mongoose.connection.on('conected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

mongoose.connect(dbURI);
