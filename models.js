'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Define AnswerSchema before QuestionSchema since the latter references the former:
var AnswerSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	votes: {type: Number, default: 0}
});

//add new method
AnswerSchema.method('update', function(updates, callback) {
	Object.assign(this, updates, {updatedAt: new Date()});
	this.parent().save(callback);
});

AnswerSchema.method('vote', function(vote, callback){
	if (vote === 'up') {
		this.votes += 1;
	} else {
		this.votes -= 1;
	}
	this.parent().save(callback);
});

var QuestionSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},  //set to current date and time
	answers: [AnswerSchema]  //indicates to Mongo that the answers will be an array of Answerschemas
});

QuestionSchema.pre('save', function (next) {
	//sort answers array before calling next
	this.answers.sort(function(a,b){ 
		if (a.votes === b.votes) {
			return b.updatedAt - a.updatedAt;
		}
		return b.votes-a.votes;
	});
	next();
})

var Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;