profile_schema = new SimpleSchema({
	name: {
		type:String,
		max:100
	},
	
	dateOfBirth: {
		type: Date,
		optional:true
	}
});

preference_schema = new SimpleSchema ({
	sendEmail: {
		type:Boolean,
		label:'Send notification emails to user'
	},
	
	sendText: {
		type:Boolean,
		label:'Send notification texts to user'
	},
	
	sendWeeklyNewsletter: {
		type:Boolean,
		label:'Send weekly newsletter to user'
	}
});

