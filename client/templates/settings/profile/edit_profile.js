Template.editProfile.onRendered(function(){
	$('.datepicker').pickadate({
    selectMonths: true,
    dateFormat:'yyyy-MM-dd',
    selectYears: 30
  });
});

Template.editProfile.onCreated(function(){
	var instance = this;

	var subscription = instance.subscribe('userSettings', {
		onReady: function() {

		},
	
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
});

Template.editProfile.helpers({
	user: function() {
		return Meteor.users.findOne({_id:Meteor.userId()});
	},
	
	dateOfBirth: function() {
		var user = Meteor.user();
		if(user && user.dateOfBirth){
			return user.dateOfBirth
		}else{
			return '';
		}
	},
	
	isVerified: function(){
		var user = Meteor.user();
		if(user && user.emails[0].address){
			return user.emails[0].verified ? 'komo-hide':'';
		}else{
			return null;
		}
	}
});

Template.editProfile.events({
	'submit form#edit-profile': function(event, tmpl){
		event.preventDefault();
		
		var name = tmpl.find('#name').value,
				dateOfBirth = tmpl.find('#dateOfBirth').value;
		
		if(isNotEmpty(name)){
			Meteor.call('/user/settings/profile/edit',name, dateOfBirth, function(err){
				if(err){
					Materialize.toast(err, 4000);
					return;
				}else{
					Materialize.toast('Update successful', 4000);
					Router.go('settings');
				}
			});
		}
	}
});

