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

	//Schema describes data, can set types and defaults:
	var Schema = mongoose.Schema;
	var AnimalSchema = new Schema({
		type: {type: String, default: 'goldfish'},
		color: {type: String, default: 'golden'},
		size: {type: String, default: 'small'},
		mass: {type: Number, default: 0.007 },
		name: {type: String, default: 'Angela'}
	});

	//create model based on schema, first param is name (traditionally plural, maps to document in database), second is schema
	var Animal = mongoose.model('Animals', AnimalSchema);

	//test instance:
	var elephant = new Animal({
		type: 'elephant',
		size: 'big',
		color: 'grey',
		mass: 6000,
		name: 'Lawrence'
	});

	// default:
	var animal = new Animal({}); //Goldfish

	var whale = new Animal({
		type: 'whale',
		size: 'big',
		mass: 190500,
		name: 'Fig'
		//notice no color, so take default.
	});

	//Clear database (passing empty object, otherwise pass a query object):
	Animal.remove({}, function (err) {
		if (err) console.error(err);
		//save after clearing:
		//have to save it, but it's asynchronous, so pass callback:
		elephant.save(function (err) {
			if (err) console.error('Save Failed', err);
			animal.save(function (err) {
				if (err) console.error('Save Failed', err);
				whale.save(function (err) {
					if (err) console.error('Save Failed', err);
					//query the db:
					Animal.find({size: 'big'}, function(err, animals) {
						animals.forEach(function(animal) {
							console.log(animal.name + " the " + animal.color + " " + animal.type);
						});
						// close db connection:
						db.close(function () {
							console.log('db closed');
						});
					});
				});
			});
	 	});
	});
	
});