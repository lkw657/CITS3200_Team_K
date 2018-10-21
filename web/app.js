require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Don't really need this, but I want to test the connection
require('./app_server/models/db')

var app = express();

app.use(require('express-session')({
    secret: 'CITS3200', // TODO randomly generate and store this
    resave: false,
    saveUninitialized: false}));

var passport = require('passport');
var User = require('./app_server/models/users').User;
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var indexRouter = require('./app_server/routes/index');
var dbRouter = require('./app_server/routes/db');
var mailRouter = require('./app_server/routes/mail');
var emailRouter = require('./app_server/routes/email');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/db', dbRouter);
app.use('/mail', mailRouter);
app.use('/email', emailRouter);
app.use('/', indexRouter);
// If no routes match send the angular app
app.use(function(req, res) {
    res.sendfile('public/index.html');
});


module.exports = app;
