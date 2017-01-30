'use strict';

var express = require('express');
var router = express.Router();
var Question = require('.models').Question;  //import Question schema

//built-in method on router to check for a param:
router.param('qID', function(req, res, next, id) {
	Question.findById(id, function(err, doc) {
		if (err) return next(err);
		if (!doc) {
			err = new Error('Not Found!');
			err.status = 404; //write not found status code
			return next(err);
		}
		req.question = doc;  //now we can just set the document retrieved as the question value on the request object and pass along to next middleware:
		return next();
	});
});


//GET /questions
// Route for questions collection
router.get('/', function(req, res, next){
	//Return all the questions:
	//pass empty object to find, return all the documents
	//2nd param is a 'projection' in Mongoose, returns partial documents (null if we don't want)
	//3rd param is options object with sort selected based on createdAt value, descending order
	//4th param is callback with error and array of documents
	//Question.find({}, null, {sort: {createdAt:-1}}, function(err, questions) {});

	// Alternative is chaining query methods together and then calling exec with the callback:
	Question.find({})
		.sort({createdAt:-1 })
		.exec(function(err, questions){
			if (err) return next(err);
			//because we're getting JS objects back from Mongo, we can call json on the response object:
			res.json(questions);
		});

	// res.json({response: "You sent me a GET request"});
});

//POST /questions
// Route for creating questions
router.post('/', function(req, res, next) {
	var question = new Question(req.body);  //create new question using Schema
	question.save(function(err, question) {
		if (err) return next(err);
		res.status(201); //save successful status code
		res.json(question); // send question back to client
	});
	//Return all the questions
	// res.json({
	// 	response: "You sent me a POST request",
	// 	body: req.body
	// });
});

//GET /questions/:qID
// Route for specific question
router.get('/:qID', function(req, res, next){
	//Already handled via param method on router, req.params.qid becomes req.question with response
	res.send(req.question);
	//Return all the questions
	// res.json({
	// 	response: "You sent me a GET request for ID " + req.params.qID
	// });
});

//POST /questions/:qID/answers
// Route for creating an answer for a specific question
router.post('/:qID/answers', function(req, res, next){
	//Already handled via param method on router
	req.question.answers.push(req.body);  //Question Schema has an array value for answers.
	req.question.save(function(err, question) {
		if (err) return next(err);
		res.status(201); //save successful status code
		res.json(question); // send question back to client
	});
	//Return all the questions
	res.json({
		response: "You sent me a POST request to/answers",
		questionId: req.params.qID,
		body: req.body
	});
});

// Put /questions/:qID/answers/:qID
// Edit a specific answer
router.put('/:qID/answers/:aID', function (req, res) {
	res.json({
		response: "You sent me a PUT request to/answers",
		questionId: req.params.qID,
		answerId: req.params.aID,
		body: req.body
	});
});

// Delete /questions/:qID/answers/:aID
// Delete a specific answer
router.delete('/:qID/answers/:aID', function (req, res) {
	res.json({
		response: "You sent me a DELETE request to/answers",
		questionId: req.params.qID,
		answerId: req.params.aID
	});
});

// Post /questions/:qID/answers/:aID/vote-up
// Post /questions/:qID/answers/:aID/vote-down
// Vote on a specific answer
router.post('/:qID/answers/:aID/vote-:dir', function (req, res, next) {
		if (req.params.dir.search(/^(up|down)$/) === -1) {
		//error-handling using RegEx
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		} else {
			console.log('whoop');
		}
	}, function (req, res) {
	res.json({
		response: "You sent me a POST request to/vote-" + req.params.dir,
		questionId: req.params.qID,
		answerId: req.params.aID,
		vote: req.params.dir
	});
});


module.exports = router;