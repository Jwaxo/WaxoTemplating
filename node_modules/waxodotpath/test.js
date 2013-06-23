//First we get our testing server all set up.

//Note that this module requires express and assert. They should already
//be there due to being dependencies
var http = require('http');
var express = require('express');
var assert = require('assert');
var server = express();

var waxoDotpath = require('./index.js'); //Our dotpath analyzer

server.configure(function() {
	server.set('title', 'Dotpath Test');
});

//Set up our dotpath and object the dotpath walks:
var find = waxoDotpath('part.key.attribute');
var body = find({part: {key: {attribute: "woop woop", another: "see here"} }})

//And now check to make sure our returned valued equals our expected value
assert.equal(body,
	"woop woop",
	"Dotpath failed to walk the dotpath from the given object!");

//Just to be sure, the returned value should either exist or be undefined
var not_body = find({}) || find() || find(null);
	
assert.equal(not_body,
	undefined,
	"Dotpath should have failed and did not!");

//Then load our output into the server and display it.
server.get('/', function (request, response) {
	response.write(body);
	response.end();
});

console.log('Server listening at 8000');

server.listen(8000);
//Now go to localhost:8000 to test it.