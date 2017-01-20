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
		size: String,
		mass: {type: Number, default: 0.007 },
		name: {type: String, default: 'Angela'}
	});

	//Create custom pre-hook for the save function:
	AnimalSchema.pre('save', function(next){
		//this refers to document being saved:
		if (this.mass >= 100) {
			this.size = 'big';
		} else if (this.mass >=5 && this.mass < 100) {
			this.size = 'medium';
		} else {
			this.size = 'small';
		}
		next();
	});

	//Create custom static method:
	AnimalSchema.statics.findSize = function(size, callback) {
		//this refers to model:
		return this.find({size: size}, callback);
	}

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

	//create an array of js object to save:
	var animalData = [{
		type: 'mouse',
		color: 'gray',
		mass: 0.035,
		name: 'Marvin'
	}, {
		type: 'nutria',
		color: 'brown',
		mass: 6.35,
		name: 'Gretchen'
	}, {
		type: 'wolf',
		color: 'gray',
		mass: 45,
		name: 'Iris'
	},
	//We can also just add instances created using the Animal model:
	elephant,
	animal,
	whale
	];

	//Clear database (passing empty object, otherwise pass a query object):
	Animal.remove({}, function (err) {
		if (err) console.error(err);
		//save after clearing:
		//have to save it, but it's asynchronous, so pass callback:
		Animal.create(animalData, function (err, animals) {
			if (err) console.error('Save Failed', err);
			//query the db:
			Animal.findSize('medium', function(err, animals) {
				animals.forEach(function(animal) {
					console.log(animal.name + " the " + animal.color + " " + animal.type + ' is a ' + animal.size + '-sized animal.' );
				});
				// close db connection:
				db.close(function () {
					console.log('db closed');
				});
			});
	 	});
	});
	
});