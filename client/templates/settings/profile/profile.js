Template.profile.helpers({
	user: function() {
		return Meteor.users.findOne({_id:Meteor.userId()});
	},
	
	email: function() {
		var user = Meteor.user();
		if(user && user.emails[0].address){
			return user.emails[0].address
		}else{
			return null;
		}
	},
	
	formatNull: function(value){
		if(value == ''){
			return 'Please fill in';
		}else{
			return value;
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
