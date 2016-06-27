/*
 * Find duplicate 'value' in an array of objects
 */

findDuplicate = function(array, needle){
	for(var i = 0; i < array.length; i++){
		if(array[i].value === needle){
			return true;
		}
	}
	
	return false;
}
