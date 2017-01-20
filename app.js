'use strict';

var express = require('express');
var logger = require('morgan');
var app = express();
var routes = require('./routes');


var jsonParser = require('body-parser').json;

app.use(logger('dev'));

app.use(jsonParser());

// Mongoose DB:
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/qa');
var db = mongoose.connection;

// listen for events on mongoose connection:
db.on('error', function (err) {
	console.error('connection:', err);
});

// Console to confirm connection:
db.once('open', function () {
	console.log('db connection successful');
});


app.use('/questions', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//Error Handler: (note 4 params)
app.use(function (err, req, res, next) {
	res.status(err.status || 500); //undefined means a 500, aka internal server
	res.json({
		error: {
			message: err.message
		}
	});
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log('Express server is listening on port ', port);
});