trimInput = function(value) {
    return value.replace(/^\s*|\s*$/g, '');
};

isNotEmpty = function(value) {
    if (value && value !== ''){
        return true;
    }
    Materialize.toast('Please fill in all fields', 4000);
    return false;
};

isEmail = function(value) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(value)) {
        return true;
    }
    Materialize.toast('Please enter a valid UMN email', 4000);
    return false;
};

isValidPassword = function(password) {
    if (password.length < 6) {
        Materialize.toast('Password should be 6 characters or longer', 4000);
        return false;
    }
    return true;
};

areValidPasswords = function(password, confirm) {
    if (!isValidPassword(password)) {
				Materialize.toast('Password should be 6 characters or longer', 4000);
        return false;
    }
    if (password !== confirm) {
        Materialize.toast('Two passwords are not matched', 4000);
        return false;
    }
    return true;
};

hasPicture = function(pictureArray){
	if(pictureArray.length <= 0){
		Materialize.toast('Pictures needed', 4000);
		return false;
	}else{
		return true;
	}
};
