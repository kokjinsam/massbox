Template.headerMenu.onRendered(function(){
	$(".button-collapse").sideNav({
		menuWidth: 260,
		closeOnClick: true
	});
});

Template.headerMenu.onDestroyed(function(){
	$('div.drag-target').remove();
});

Template.headerMenu.helpers({
	setColor: function() {
		var routeName = Router.current().route.getName();
		
		if(routeName == 'seller.dashboard' || routeName == 'seller.requests' ||
			routeName == 'seller.requests.edit' || routeName == 'seller.items' ||
			routeName == 'seller.items.add' || routeName == 'seller.items.edit') {
		
			return 'komo-nav-brown';
		}else{
			return 'komo-nav-blue';
		}
	}
});

Template.homeSlideOut.events({
	'click #meteor-logout': function (event, tmpl) {
		Meteor.logout(function() {
			Materialize.toast('Logout was successful', 5000);
		});
		
		return false;
	}
});

Template.homeSlideOut.helpers({
	email: function() {
		var user = Meteor.user();
		if(user && user.emails[0].address){
			return user.emails[0].address
		}else{
			return null;
		}
	},
	
	hideRequestCount: function() {
		return Counts.get('request-buyer-count') == 0 ? 'komo-hide':'';
	},
	
	hideMessageCount: function() {
		return Counts.get('message-buyer-count') == 0 ? 'komo-hide':'';
	}
});

Template.homeSlideOut.onCreated(function(){
	var instance = this;
	
	var subscription = instance.subscribe('dashboard');
});

Template.dashboardSlideOut.helpers({
	email: function() {
		var user = Meteor.user();
		if(user && user.emails[0].address){
			return user.emails[0].address
		}else{
			return null;
		}
	},
	
	hideRequestCount: function() {
		return Counts.get('request-count') == 0 ? 'komo-hide':'';
	},
	
	hideMessageCount: function() {
		return Counts.get('message-count') == 0 ? 'komo-hide':'';
	}
});

Template.dashboardSlideOut.events({
	'click #meteor-logout': function (event, tmpl) {
		Meteor.logout(function() {
			Materialize.toast('Logout was successful', 5000);
		});
		
		return false;
	}
});

Template.dashboardSlideOut.onCreated(function(){
	var instance = this;
	
	var subscription = instance.subscribe('dashboard');
});
