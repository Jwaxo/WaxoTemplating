//First we get our testing server all set up.

//Note that this module requires http, express, and assert. It probably doesn't
//really need express, I just find it simpler.
var http = require('http');
var express = require('express');
var assert = require('assert');
var server = express();

var waxoLanguage = require('waxolanguage'); //Here's the final engine

server.configure(function() {
	server.set('title', 'Tiny Templating Test');
});

var waxoCompile = waxoLanguage( {
	'if': 'IF_STANDIN'
  , 'for': 'FOR_STANDIN'
});

//Template to be parsed:
var template = waxoCompile("Hello {{ world }}, how is your {{ weekday }} going, {{ world }}?");
var body = template({
	world: 'dude'
	, weekday: 'Tuesday'
});
console.log("Output given as: '" + body + "'");
//And that should parse and replace it, so we test:

assert.equal(body,
	"Hello dude, how is your Tuesday going, dude?",
	"Templater failed to properly replace!");

//Then load our output into the server and display it.
server.get('/', function (request, response) {
	response.write(body);
	response.end();
});

console.log('Server listening at 8000');

server.listen(8000);
//Now go to localhost:8000 to test it.