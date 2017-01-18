'use strict';

var express = require('express');
var logger = require('morgan');
var app = express();
var routes = require('./routes');


var jsonParser = require('body-parser').json;

app.use(logger('dev'));

app.use(jsonParser());
app.use('/questions', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//Error Handler: (note 4 params)
app.use(function (err, req, res, next) {
	res.status(err.status || 500); //500/undefined if internal server
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