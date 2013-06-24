//First we get our testing server all set up.

//Note that this module requires http, express, and assert. It probably doesn't
//really need express, I just find it simpler.
var http = require('http');
var express = require('express');
var assert = require('assert');
var server = express();

var waxoLanguage = require('./index.js'); //Here's the "real" engine
//Then we require all of the individual language tags
var waxoIf = require('waxolanguageif');
var waxoFor = require('waxolanguagefor');

//Assign the basic parsing tags
var waxoCompile = waxoLanguage( {
	'if': waxoIf
  , 'for': waxoFor
});

//Assign our test string, which is a simple HTML and Waxo file
var testHTML = "<ul>\
{% for item in items reversed %}\
    <li>{% if item.okay %}it's okay{% else %}it's not okay{% endif %}</li>\
{% endfor %}\
</ul>\
{{ message }}";

/*var testHTML = "<ul>{% for item in items %}This should appear. That also works.{% endfor %}</ul>{{ message }}";*/

/*var testHTML = "{% if dotpath.thisone eq false %}This should appear.{% else %}That also works.{% endif %}{{ message }}";*/

//Parse the whole thing for compilation
var template = waxoCompile(testHTML);

//And compile our string with the final replacements
var body = template({
	dotpath: {
		thisone: true
	  , thatone: false
	}
  ,	items: [{okay: true}, {okay: false}]
  ,	message: 'hello world'
});
console.log("Output given as: '" + body + "'");
//And that should parse and replace it, so we test:

/*
assert.equal(body,
	"Hello dude, how is your Tuesday going, dude?",
	"Templater failed to properly replace!");
	*/

//Then load our output into the server and display it.
server.get('/', function (request, response) {
	response.write(body);
	response.end();
});

console.log('Server listening at 8000');

server.listen(8000);
//Now go to localhost:8000 to test it.