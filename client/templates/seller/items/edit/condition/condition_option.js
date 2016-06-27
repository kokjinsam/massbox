Template.conditionOption.helpers({
	condition: function() {
		return [{
			value:'new',
			text:'New'
		},{
			value:'like new',
			text:'Used - Like New'
		},{
			value:'very good',
			text:'Used - Very good'
		},{
			value:'good',
			text:'Used - Good'
		},{
			value:'acceptable',
			text:'Used - Acceptable'
		}];
	},
	
	selected: function(value, condition) {
		return value == condition ? 'selected': '';
	}
});
