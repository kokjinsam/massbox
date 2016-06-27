/*
 * Server only, Non-meteor methods
 */

/*
 * Arr2 is the original
 * Arr1 is the array that needs to be checked
 * return difference
 */
 
compareArray = function(arr1, arr2){
	
	var removed =[];
	
	for(var i = 0; i < arr2.length; i++){
		if (arr1.indexOf(arr2[i]) == -1){
			removed.push(arr2[i]);
		}
	}
	
	if(removed.length > 0){
		return removed;
	}else{
		return null;
	}
}

/*
 * Check to see if Obj1 contains Obj2
 * Return: true if Obj1 contains Obj2
 */
 
compareObject = function(obj1, obj2) {
	return _.chain(obj2)
		.keys()
		.every(function(currentKey){
			return _.has(obj1, currentKey) && _.isEqual(obj1[currentKey], obj2[currentKey]);
		}).value();
}

