eventController = RouteController.extend({
  layoutTemplate: 'layoutOneMain',

  subscriptions: function() {
  },

  listRequests: function() {
    this.render('requests');
    this.render('requestsTabs',{to:'tabs'});
    this.render('headerDirectTabs',{to:'header'});
  },
  
  viewRequest: function() {
		this.render('request');
		this.render('headerDirect',{to:'header'});
	},
	
	editRequest: function() {
		this.render('editRequest');
		this.render('headerDirect',{to:'header'});
	},
	
	addRequest: function() {
		this.render('addRequest');
	},
	
	about: function(){
		this.render('about');
	},
	
	faq: function(){
		this.render('faq');
		this.render('transparentHeader',{to:'header'});
	},
	
	listMessages: function() {
		this.render('messages');
		this.render('headerDirect',{to:'header'});
	},
	
	viewMessage: function() {
		this.render('message');
		this.render('headerDirect',{to:'header'});
	}
});
