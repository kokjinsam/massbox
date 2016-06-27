Template.sellerSignUp.events({
	'click #sign-up': function(event, tmpl) {
		Meteor.call('/seller/sign-up', function(err){
			if(err){
				console.log(err.message);
			}else{
				Router.go('seller.dashboard');
			}
		});
		
	}
});

Template.sellerSignUp.onRendered(function(){
	$('html').addClass('komo-background__green');
});

Template.sellerSignUp.onDestroyed(function(){
	$('html').removeClass('komo-background__green');
});
