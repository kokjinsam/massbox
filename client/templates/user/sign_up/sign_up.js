Template.signUp.events({
	'submit form#sign-up': function(event, tmpl){
		event.preventDefault();
		var email = trimInput(tmpl.find('#email').value.toLowerCase()),
				name = tmpl.find('#name').value,
				password = tmpl.find('#password').value,
				confirmPassword = tmpl.find('#confirm-password').value; 
				
		if(isNotEmpty(email) && isNotEmpty(name) && isNotEmpty(password) && isEmail(email) && areValidPasswords(password, confirmPassword)) {
			Meteor.call('/users/sign-up', email, password, name, function(err, result){
				if(err){
					Materialize.toast(err, 4000);
				}else{
					Materialize.toast('Please validate email address', 4000);
					Router.go('user.signIn');
				}
			});
		}
	}
});

Template.signUp.onRendered(function(){
	$('html').addClass('komo-background__blue');
});

Template.signUp.onDestroyed(function(){
	$('html').removeClass('komo-background__blue');
});
