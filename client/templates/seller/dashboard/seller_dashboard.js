Template.sellerDashboard.events({  
  'click #meteor-logout': function (event, tmpl) {
		Meteor.logout(function() {
			Materialize.toast('Logout was successful', 5000);
		});
		
		return false;
	}
});

Template.sellerDashboard.onCreated(function(){
	var instance = this;
	
	var subscription = instance.subscribe('dashboard', {
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
});

Template.sellerDashboard.helpers({
	hideRequestCount: function() {
		return Counts.get('request-count') == 0 ? 'komo-hide':'';
	},
	
	hideMessageCount: function() {
		return Counts.get('message-count') == 0 ? 'komo-hide':'';
	},
	
	showMessage: function() {
		return Counts.get('request-count') == 0 ? '':'komo-hide';
	}
});
