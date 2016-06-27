Meteor.methods({
	'/messages/send': function(message, roomId){
		if(this.isSimulation){
			var sender = Meteor.userId();
			Message.insert({
				room:roomId,
				sender:sender,
				message:message,
				timestamp:new Date(),
				status:'sent'
			});
		}
	}
});
