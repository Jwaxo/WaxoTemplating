module.exports = function(string) {

	var variables = new Array();

	//We're going about this backwards from what I would normally think to,
	//in order to prevent double-variable assignments. If that makes sense.
	//Essentially, first we look at our provided "mini template" and see
	//what variables we'll need to be watching out for, and assign them
	//to their own mini-functions.

	var toChop = /\{\{\s*(\w+)\s*\}\}/g; //How we recognize a template variable
	var chopBit = null;
	var teststring = new String();
	
	//Now we search for the variables and put them into our variables array
	while (chopBit = toChop.exec(string)) {
		var inArray = false;
		//We have it chopped, so we make sure it isn't already in the var array
		for (var i=0;i<variables.length;i++) {
			if (variables[i] === chopBit) {
				inArray = true;
			}
		}
		//If it isn't, push it on
		if(inArray !== true) {
			variables.push(chopBit);
		}
		console.log('Adding template variable ' + chopBit[0]);
	}
	
	//And now create the function that will be run after the initial string set
	var toBeRendered = function(replacements) {
		console.log('Replacing template variables.')
		for (var i=0;i<variables.length;i++) {
			//Here we loop through the initial variables and see if that
			//variable was submitted
			if(replacements.hasOwnProperty(variables[i][1])) {
				string = string.replace(variables[i][0],replacements[variables[i][1]]);
			}
		}
		console.log('Template variables replaced.')
		return string;
	}
	
	return toBeRendered;
};