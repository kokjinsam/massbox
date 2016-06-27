Template.message.onCreated(function(){
	var instance = this,
			route = Router.current(),
			roomId = route.params._id;
			
	instance.subReady = new ReactiveVar(false);
	
	var subscription = instance.subscribe('room', roomId, {
		onReady: function(){
			$('html, body').animate({
				scrollTop: $(window).height()}, 'slow');
			instance.subReady.set(true);
			var name = Meteor.users.findOne({_id:{$ne:Meteor.userId()}});
			if(name){
				Session.set('title', name.name);
			}
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
});

Template.message.helpers({
	messages: function(){
		if(Template.instance().subReady.get()){
			return Message.find();
		}
	},
	
	isSender: function(userId){
		if(Template.instance().subReady.get()){
			return userId == Meteor.userId();
		}
	}
});

Template.message.onRendered(function(){
	$('html, body').animate({
		scrollTop: $(window).height()}, 'slow');
});

Template.sendMessage.onRendered(function(){
	$('input#input_message').characterCounter();
	
	var max140 = 140;
	$('input#input_message').keypress(function(event){
		if (event.which < 0x20) {
			return;
		}
		
		if (this.value.length == max140) {
			event.preventDefault();
		} else if (this.value.length > max140) {
			this.value = this.value.substring(0,max140);
		}
	});
});

Template.sendMessage.events({
	'submit form#send-message': function(event, tmpl){
		event.preventDefault();
		
		var message = tmpl.find('#input_message').value,
				roomId = Router.current().params._id;
		
		$('#input_message').val('');
		$('html, body').animate({
			scrollTop: $(document).height()}, 'slow');
		
		if(isNotEmpty(message) && isNotEmpty(roomId)){
			Meteor.call('/messages/send', message, roomId, function(err, result){
				if(err){
					Materialize.toast(err, 4000);
				}
				return;
			});
		}
	}
});
