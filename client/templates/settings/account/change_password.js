Template.changePassword.events({
	'submit #change-password': function(event, tmpl){
		event.preventDefault();
		
		var oldPassword = trimInput(tmpl.find('#old-password').value),
				newPassword = trimInput(tmpl.find('#new-password').value),
				confirmPassword = trimInput(tmpl.find('#confirm-password').value);
				
		if(isNotEmpty(oldPassword) && isNotEmpty(newPassword) && isNotEmpty(confirmPassword) &&
			isValidPassword(oldPassword) && isValidPassword(newPassword) && isValidPassword(confirmPassword) &&
			areValidPasswords(newPassword, confirmPassword)) {
			Accounts.changePassword(oldPassword, newPassword, function(err, result){
				if(err){
					if(err == 'Error: Incorrect password [403]'){
						Materialize.toast('Incorrect Password', 4000);
					}else{
						Materialize.toast(err, 4000);
					}
				}else{
					Materialize.toast('Update password was succcesful',4000);
					history.go(-1);
				}
			});
		}
	}
});
