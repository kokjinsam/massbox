Template.messages.onCreated(function(){
	var instance = this,
			mode = Session.get('mode');
			
	instance.subReady = new ReactiveVar(false);
	instance.sub2Ready = new ReactiveVar(false);
	
	var subscription = instance.subscribe('rooms', mode, {
		onReady: function(){
			instance.subReady.set(true);
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
	
	var secondSubscription = instance.subscribe('oneLineMessage', mode,{
		onReady: function(){
			instance.sub2Ready.set(true);
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
});

Template.messages.helpers({
	isSeller: function(){
		return Session.get('mode') == 'seller';
	},
	
	rooms: function(){
		if(Template.instance().subReady.get()){
			return Room.find({});
		}
	},
	
	formatName: function(userId){
		if(Template.instance().subReady.get()){
			var user = Meteor.users.findOne({_id:userId});
			return user.name;
		}
	},
	
	findMsg: function(roomId){
		if(Template.instance().sub2Ready.get()){
			var message = oneLineMessage.findOne({_id:roomId});
			return message.message;
		}
	},
	
	isNew: function(roomId){
		if(Template.instance().sub2Ready.get()){
			var message = oneLineMessage.findOne({_id:roomId});
			return message.status == 'delivered' && message.sender != Meteor.userId() ? '':'komo-hide';
		}
		
		return 'komo-hide';
	},
	
	subReady: function(){
		return Template.instance().subReady.get();
	},
	
	noRooms: function(){
		if(Template.instance().subReady.get()){
			return Room.find().count() == 0;
		}
	}
});
