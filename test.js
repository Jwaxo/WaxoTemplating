//First we get our server all set up.

var http = require('http');
var express = require('express');
var assert = require('assert');
var server = express();

var waxoRender = require('./index.js').waxoRender;

server.configure(function() {
	server.set('title', 'Tiny Templating Test');
});

//Parse our template here. The prompt doesn't call for separate files to be
//loaded, so just use this dummy text.

var body = waxoRender("hello {{ world }} how is your {{ weekday }} going?");

//Then load our output into the server and display it.

server.get('/', function (request, response) {
	response.write(body({world: 'dude', weekday: 'tuesday'}));
	response.end();
});

console.log('Server listening at 8000');

server.listen(8000);
//Now go to localhost:8000 to test it.