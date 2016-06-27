request_schema = new SimpleSchema({
	method:{
		type:String,
		allowedValues:['pick up', 'meet up', 'drop off'],
		label:'Method'
	},
	date:{
		type:String,
		min:1,
		label:'Schedule a date for meetup'
	},
	place:{
		type:String,
		min:1,
		label:'Pick a place for meetup'
	},
	time:{
		type:String,
		min:1,
		label:'Pick a time for meetup'
	}
});

request_item_schema = new SimpleSchema({
	items:{
		type:Array,
		minCount:1,
		label:'an array of items requested'
	},
	'items.$':{
		type: String,
		label:'requested product id'
	}
});

_request_schema = new SimpleSchema({
	buyer:{
		type:String,
		label:'buyer id'
	},
	seller:{
		type:String,
		label:'seller id'
	},
	status:{
		type:String,
		label:'Status of this request'
	},
	delivered:{
		type:Boolean,
		label:'Set this request to delivered'
	}
});
