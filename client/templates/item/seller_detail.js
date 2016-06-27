Template.sellerDetail.helpers({
	seller: function() {
		return Meteor.users.findOne({_id:this.owner});
	}
});

Template.sellerDetail.onRendered(function(){
	$('.modal-trigger').leanModal();
});

Template.sellerDetail.events({
	'click #send-message': function(event, tmpl){
		event.preventDefault();
		
		var message = tmpl.find('#input_message').value,
				user = Meteor.users.findOne({_id:this.owner}),
				recipient = user._id;
		
		if(isNotEmpty(message) && isNotEmpty(recipient)){
			Meteor.call('/messages/inquire', message, recipient, function(err, result){
				if(err){
					$('#modal1').closeModal();
					$('#input_message').val('');
					Materialize.toast(err, 4000);
					return;
				}else{
					$('#modal1').closeModal();
					$('#input_message').val('');
					Materialize.toast('Message sent!', 4000);
					return;
				}
			});
		}
	}
});
