'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sandbox');


var db = mongoose.connection;

// listen for events on mongoose connection:
db.on('error', function (err) {
	console.error('connection:', err);
});

// once only runs once
db.once('open', function () {
	console.log('db connection successful');
	// All database connection goes here.

	//Schema describes data:
	var Schema = mongoose.Schema;
	var AnimalSchema = new Schema({
		type: String,
		color: String,
		size: String,
		mass: Number,
		name: String
	});

	//create model based on schema, first param is name (traditionally plural, maps to document in database), second is schema
	var Animal = mongoose.model('Animals', AnimalSchema);

	//test instance:
	var elephant = new Animal({
		type: 'elephant',
		size: 'large',
		color: 'grey',
		mass: 6000,
		name: 'Lawrence'
	});

	//have to save it, but it's asynchronous, so pass callback:
	elephant.save(function (err) {
		if (err) console.error('Save Failed', err);
		else console.log('Saved!');
		// close db connection:
		db.close(function () {
			console.log('db closed');
		});
	});
});