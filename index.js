module.exports = function(tags) {

	var parser = new Parser(); //Initiate the parser
	parser.parse(tags);

	waxoCompile = function(string) {
		
		//After the previous parsing is complete, we parse remaining variable
		//replacements, starting out by first listing what variables we'll need
		//to be watching out for.
		
		//And now create the function that will be run after the initial string set
		var toBeRendered = function(replacements) {
		

			parser.parseTags(replacements);
			var finalHTML = null;
			
			//The way this is set up implies that the parser can have its code
			//functions looked up before the replacement tags are set, which
			//should be impossible, so we have waited until we receive our
			//replacements to try to parse.

			string = parser.search(string, null);
			
			var tagChop = /(\{\{\s*)(\w+?)(\s*\}\})/g; //Find tags
			var tagChopBits = string.match(tagChop); 
			console.log('Adding template variables ' + tagChopBits);
			
			if (tagChopBits != null) {
				for (var i=0;i<tagChopBits.length;i++) {
					console.log('Replacing template bits.')
					//Here we loop through the initial variables and see if that
					//variable was submitted, after first chopping the brackets off
					var shorterBit = tagChopBits[i].replace(/\{\{\s*(.*?)\s*\}\}/, "$1");
					console.log("Replacing instance of '" + tagChopBits[i] + "'.");
					if(replacements.hasOwnProperty(shorterBit)) {
						string = string.replace(tagChopBits[i],replacements[shorterBit]);
					}
				}
			}
			console.log('Template variables replaced.')
			return string; //And return the final HTML
		}
		
		return toBeRendered;
	}
	
	return waxoCompile;
	
};

function Parser() {

	this.functions = {};
	this.tags = {}
	
	//This saves given functional tags to an object, so they can be checked and called
	this.parse = function(tags) {
		for (var t in tags) {
			//console.log("Saving new functions '" + t + "'.");
			this.functions[t] = tags[t];
		}
	}

	//This is nearly identical, but for variable tags. We keep them separate for
	//neatness, mostly.
	this.parseTags = function(tags) {
		for (var t in tags) {
			//console.log("Saving new variable tag '" + t + "'.");
			this.tags[t] = tags[t];
		}
	}
	
	//Sometimes, as in a for loop, we create temporary tags. This will remove
	//them afterward.
	this.rmTags = function(tags) {
		for (var t in tags) {
			//console.log("Removing variable tag '" + t + "'.");
			delete this.tags[t];
		}
	}
	
	//This runs a parsed tag, with the option of specifying you're looking for
	//the end tag. I couldn't find a more efficient way to do that, although
	//there probably is.
	this.search = function(string, searchedEnd) {
		var funcChop = /{%\s*([\w\d\s\-\.]*)\s*%}/gi; //Find functions
		var funcChopBit = null;
		
		while (funcChopBit = funcChop.exec(string)) {
			//console.log("Reading function '" + funcChopBit[1] + "'.");
			var possibleFunction = funcChopBit[1].split(/\s+/);
			var parsedFunction = this.findFunc(possibleFunction[0]);
			if (parsedFunction != null) {
				if (possibleFunction[0] == 'end' + searchedEnd) {
					//If there is a matching function, and we're looking for an end
					//tag, then return the function of the end tag.
					console.log("Found end of parsed function '" + searchedEnd + "', returning.");
					string = parsedFunction(string, funcChopBit);
				} else if (searchedEnd == null) {
					//If we're encountering the first half of a function tag,
					//then check to make sure it has an end tag, so we know
					//where to stop reading input
					var runParsed = parsedFunction(this,funcChopBit[1]);
					var hasEnd = this.findFunc('end' + possibleFunction[0]);
					var parsedString = '';
					if (hasEnd != null && hasEnd != undefined) {
						//There is one (since all main tag functions should),
						//so run a search for new tags to read until we find the
						//end tag
						var endParsed = this.search(string.substring(
							funcChopBit.index + funcChopBit[0].length
						), possibleFunction[0]);

						parsedString = runParsed(string, endParsed.tpl);
						console.log("And we have parsed: '" + parsedString + "' from function '" + possibleFunction[0] + "'.");
						
						//We have everything in order, hopefully, so replace our
						//newly-formatted stuff into the origin string.
						string = this.replaceInto(funcChopBit.index, funcChopBit.index + endParsed.endpoint + funcChopBit[0].length, parsedString, string);
					}
				}
			}
		}
		return string;
	}
	
	//Sometimes, as in the case of elseif or else tags, we need to look for a
	//function that does not have an end tag, so we use this function to find
	//specific ones, which are outlined on the individual tag module pages
	this.searchSpecifics = function(string, searched) {
		var foundFuncs = new Array();
		var funcChopBit;

		for (var i = 0;i<searched.length;i++) {
			var funcChop = new RegExp("{%\\s*(" + searched[i] + "*)\\s*%}", "g");

			while (funcChopBit = funcChop.exec(string)) {
				foundFuncs.push(funcChopBit);
			}
		}
		return foundFuncs;
	}
	
	//We keep function tags separate from variable tags for housekeeping purposes	
	this.findFunc = function(bit) {
		thisFunction = null;
		//console.log("Looking up parser function '" + bit + "'.");
		if (this.functions.hasOwnProperty(bit)) {
			thisFunction = this.functions[bit];
		}
		return thisFunction;
	}
	
	this.lookup = function(bit) {
		//console.log("Looking up variable tag '" + bit + "'.");
		if (this.tags.hasOwnProperty(bit)) {
			parsedTags = this.tags;
			return function() {
				return parsedTags[bit];
			}
		}
	}
	
	//And, finally, the tiny function that replaces parsed code into the template
	this.replaceInto = function(startDex, endDex, from, to) {
		return to.substring(0, startDex) + from + to.substring(endDex);
	}
}