userController = RouteController.extend({
  layoutTemplate: 'layoutFull',

  signUp: function() {
    this.render('signUp');
  },
  
  signIn: function() {
		this.render('signIn');
	},
	
	forgotPassword: function() {
		this.render('forgotPassword');
	},
	
	profile: function(){
		this.render('temp');
	},
	
	onboarding:function(){
		this.render('onboarding');
	}
});
