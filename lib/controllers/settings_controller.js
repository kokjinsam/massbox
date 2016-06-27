settingsController = RouteController.extend({
  layoutTemplate: 'layoutOneMain',

  subscriptions: function() {
  },

  main: function() {
    this.render('settings');
    this.render('settingsTabs',{to:'tabs'});
    this.render('headerDirectTabs',{to:'header'});
  },
  
  editProfile: function() {
		this.render('editProfile');
		this.render('headerDirect',{to:'header'});
	},
	
	changePassword: function() {
		this.render('changePassword');
		this.render('headerDirect',{to:'header'});
	}
});
