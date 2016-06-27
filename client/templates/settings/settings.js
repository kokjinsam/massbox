Template.settings.onRendered(function() {
	$('ul.tabs').tabs();
});

Template.settings.onCreated(function(){
	var instance = this;
	
	// initialize the reactive variables
  instance.subReady = new ReactiveVar(false);
  
	// subscribe to the products publication
	var subscription = instance.subscribe('userSettings', {
		onReady: function() {
			instance.subReady.set(true);
		},
	
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
});

Template.settings.helpers({
	user: function() {
		return Meteor.users.findOne({_id:Meteor.userId()});
	}
});
