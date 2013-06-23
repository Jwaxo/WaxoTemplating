module.exports = function(string) {
	console.log("Splitting string '" + string + "'.");
	var objectsContainer = {}; //We use a basic container to hold the new object

	//Then we split up the string on "." to the array we will walk through
	string = string.split(".");
	console.log("String is split to '" + string + "'.");
	var dotPathSearch = function(found) {
		
		//Now walk down the given object from our split string
		for (var i = 0;i < string.length; i++) {
			console.log("Walking to '" + string[i] + "'.");
			if (found == undefined) { //First check to make sure it won't break
				found = undefined;
			} else if (found.hasOwnProperty(string[i])) { //Now get the next step
				found = found[string[i]];
			} else { //And if we don't, then return undefined as well
				found = undefined;
			}
		}
		
		console.log("Found '" + found + "', returning.");
		
		return found;
	}

	return dotPathSearch;
};