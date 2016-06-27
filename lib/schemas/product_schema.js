product_schema = new SimpleSchema({
	//basic information
	category:{
		type:String,
		allowedValues:['books','electronics','furniture','clothing','shoes','kitchen', 'vehicle', 'misc'],
		label:'Item Category'
	},
	method:{
		type:String,
		allowedValues:['pick up','meet up','drop off'],
		label:'Item Handling Method'
	},
	condition:{
		type:String,
		allowedValues:['new','like new','very good','good','acceptable'],
		label:'Item Condition'
	},
	price:{
		type:Number,
		min:0,
		max:100000,
		label:'Item Price'
	},
	numberOfTimesUsed:{
		type:String,
		allowedValues:['less than 5','less than 15','less than 45','more than 100', 'uncountable'],
		label:'Number of Times Item Used'
	},
	notes:{
		type:String,
		max:120,
		label:'Notes',
		optional:true
	},
	views:{
		type:Number,
		label:'total view count for item',
		optional:true
	},
	status:{
		type:String,
		allowedValues:['active','unlisted','sold','removed','requested'],
		label:'status of the item'
	},
	
	//additional information
	title:{
		type:String,
		label:'Book Title',
		optional:true
	},
	classTitle:{
		type:String,
		label:'Class Title',
		optional:true,
		min:2,
		max:4
	},
	classNumber:{
		type:Number,
		min:1000,
		max:9999,
		label:'Class Number',
		optional:true
	},
	brand:{
		type:String,
		max:100,
		label:'Brand',
		optional:true
	},
	make:{
		type:String,
		max:100,
		label:'Make',
		optional:true
	},
	dimLength:{
		type:Number,
		max:100000,
		label:'Length',
		optional:true
	},
	dimWidth:{
		type:Number,
		max:100000,
		label:'Width',
		optional:true
	},
	dimHeight:{
		type:Number,
		max:100000,
		label:'Height',
		optional:true
	},
	length:{
		type:Number,
		max:100000,
		label:'Length',
		optional:true
	},
	width:{
		type:Number,
		max:100000,
		label:'Width',
		optional:true
	},
	height:{
		type:Number,
		max:100000,
		label:'Height',
		optional:true
	},
	mileage:{
		type:Number,
		label:'Mileage',
		optional:true
	},
	year:{
		type:Number,
		label:'Year',
		optional:true
	},
	speed:{
		type:String,
		allowedValues:['single','6','9','12','24','32'],
		label:'Speed',
		optional:true
	},
	type:{
		type:String,
		label:'Type',
		optional:true
	},
	size:{
		type:String,
		allowedValues:['xs','s','m','l','xl'],
		label:'Size (alphabet)',
		optional:true
	},
	sizeNumber:{
		type:Number,
		label:'Size (number)',
		optional:true
	},
	sex:{
		type:String,
		allowedValues:['male','female','unisex'],
		label:'Sex',
		optional:true
	},
	color:{
		type:String,
		label:'Color',
		optional:true
	}
});
