Template.signIn.events({
	'submit form#sign-in': function(event, tmpl) {
		event.preventDefault();
		var email = trimInput(tmpl.find('#email').value.toLowerCase()),
				password = tmpl.find('#password').value;
				
    if (isNotEmpty(email) && isNotEmpty(password) && isEmail(email)) {
			Meteor.loginWithPassword(email, password, function(err) {
				if(err){
					if(err.error == 'email not verified'){
						Materialize.toast('Please verify your email', 4000);
					}else{
						Materialize.toast('Incorrect email / password', 4000);
					}
				}else{
					Materialize.toast('Welcome to Massbox', 3000);
					history.go(-1);
				}
			});
		}
		return false;
	}
});

Template.signIn.onRendered(function(){
	$('html').addClass('komo-background__blue');
});

Template.signIn.onDestroyed(function(){
	$('html').removeClass('komo-background__blue');
});
