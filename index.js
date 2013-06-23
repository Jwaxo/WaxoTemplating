module.exports = function(string) {

	var variables = new Array();

	//We're going about this backwards from what I would normally think to,
	//in order to prevent double-variable assignments. If that makes sense.
	//Essentially, first we look at our provided "mini template" and see
	//what variables we'll need to be watching out for, and assign them
	//to their own mini-functions.

	var toChop = /(\{\{\s*)(\w+?)(\s*\}\})/g; //How we recognize a template variable
	var chopBit = null;
	var teststring = new String();
	
	//Now we search for the variables and put them into our variables array
	//I figured out a way to do this without a loop, but couldn't do the
	//replacement bit without one.
	chopBits = string.match(toChop); 
	console.log('Adding template variables ' + chopBits);
	
	//And now create the function that will be run after the initial string set
	var toBeRendered = function(replacements) {
		console.log('Replacing template variables.')
		for (var i=0;i<chopBits.length;i++) {
			//Here we loop through the initial variables and see if that
			//variable was submitted, after first chopping the brackets off
			var shorterBit = chopBits[i].replace(/\{\{\s*(.*?)\s*\}\}/, "$1");
			console.log("Replacing instance of '" + chopBits[i] + "'.");
			if(replacements.hasOwnProperty(shorterBit)) {
				string = string.replace(chopBits[i],replacements[shorterBit]);
			}
		}
		console.log('Template variables replaced.')
		return string;
	}
	
	return toBeRendered;
};