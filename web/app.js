require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./app_server/routes/index');
var dbRouter = require('./app_server/routes/db');
var mailRouter = require('./app_server/routes/mail');

// Don't really need this, but I want to test the connection
require('./app_server/models/db')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/db', dbRouter);
app.use('/mail', mailRouter);
app.use('/', indexRouter);

module.exports = app;
